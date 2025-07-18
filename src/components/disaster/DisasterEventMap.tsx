import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import ReactDOM from "react-dom";

// Fix default Leaflet icon issue
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Impact {
  type: string;
  value: string;
  objectName?: string;
}

interface ReportPhoto {
  id: number;
  disasterEventId: number;
  filePath: string;
  fileType: "Photo" | "Video";
}

interface DisasterEvent {
  id: number;
  name: string;
  year: number;
  type: string;
  description: string;
  impacts: Impact[];
  reportPhotos?: ReportPhoto[];
}

interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSON.Geometry;
  properties: DisasterEvent;
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Sample backend GeoJSON data (points + polygons)
const sampleGeoJSONData: GeoJSONData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [96.15, 16.85],
      },
      properties: {
        id: 1,
        name: "Cyclone Nargis 2",
        year: 2018,
        type: "Cyclone",
        description: "Severe cyclone with significant damage and casualties.",
        impacts: [
          { type: "Affected People", value: "500000" },
          { type: "Deaths", value: "1000" },
        ],
        reportPhotos: [
          {
            id: 1,
            disasterEventId: 1,
            filePath: "https://example.com/photos/cyclone-nargis-2-damage.jpg",
            fileType: "Photo",
          },
          {
            id: 2,
            disasterEventId: 1,
            filePath: "https://example.com/videos/cyclone-nargis-2-storm.mp4",
            fileType: "Video",
          },
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [96.0, 16.5],
            [96.6, 16.5],
            [96.6, 17.0],
            [96.0, 17.0],
            [96.0, 16.5],
          ],
        ],
      },
      properties: {
        id: 1,
        name: "Cyclone Nargis 2",
        year: 2018,
        type: "Cyclone",
        description: "Severe cyclone with significant damage and casualties.",
        impacts: [
          { type: "Affected People", value: "500000" },
          { type: "Deaths", value: "1000" },
        ],
        reportPhotos: [
          {
            id: 1,
            disasterEventId: 1,
            filePath: "https://example.com/photos/cyclone-nargis-2-damage.jpg",
            fileType: "Photo",
          },
          {
            id: 2,
            disasterEventId: 1,
            filePath: "https://example.com/videos/cyclone-nargis-2-storm.mp4",
            fileType: "Video",
          },
        ],
      },
    },
    // Add more point features (without polygons) similarly for other disasters
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [96.15, 16.8] },
      properties: {
        id: 2,
        name: "Yangon Flood",
        year: 2019,
        type: "Flood",
        description: "Flooding affected large areas in Yangon.",
        impacts: [
          { type: "Affected People", value: "200000" },
          { type: "Deaths", value: "50" },
        ],
      },
    },
    // ... More disaster events (total 10+)
  ],
};

type ModalProps = {
  event: DisasterEvent | null;
  onClose: () => void;
};

function EventModal({ event, onClose }: ModalProps) {
  if (!event) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-3xl bg-white rounded-md overflow-auto max-h-[90vh] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-900"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-2 text-blue-900">
          {event.name} ({event.year})
        </h2>
        <p className="mb-4">{event.description}</p>
        <h3 className="font-semibold mb-1">Impacts</h3>
        <ul className="list-disc list-inside mb-4 text-gray-800">
          {event.impacts.map((imp, idx) => (
            <li key={idx}>
              {imp.type}: {imp.value}
              {imp.objectName ? ` (${imp.objectName})` : ""}
            </li>
          ))}
        </ul>

        {event.reportPhotos && event.reportPhotos.length > 0 && (
          <>
            <h3 className="font-semibold mb-2">Photos & Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.reportPhotos.map(({ id, filePath, fileType }) => (
                <div key={id} className="rounded shadow overflow-hidden border">
                  {fileType === "Photo" ? (
                    <img
                      src={filePath}
                      alt={`${event.name} photo`}
                      className="object-cover w-full h-48"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={filePath}
                      controls
                      className="w-full h-48 bg-black"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const MapView = ({
  geojson,
  onSelectEvent,
}: {
  geojson: GeoJSONData;
  onSelectEvent: (event: DisasterEvent) => void;
}) => {
  const mapRef = useRef<L.Map>(null);

  // Remember currently highlighted polygon to unhighlight on next
  const highlightedPolygonRef = useRef<L.Layer | null>(null);

  // Custom style function to style points and polygons differently
  const styleFunction = (
    feature: L.GeoJSONFeature
  ): L.PathOptions | L.PathOptions[] => {
    const geomType = feature.geometry.type;
    if (geomType === "Polygon" || geomType === "MultiPolygon") {
      return {
        fillColor: "rgba(255,0,0,0.3)",
        color: "rgba(255,0,0,0.8)",
        weight: 2,
      };
    } else {
      return {
        radius: 7,
        fillColor: "rgba(255, 0, 0, 0.7)",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      };
    }
  };

  // Handler when clicking a feature
  const onEachFeature = (
    feature: GeoJSON.Feature,
    layer: L.Layer
  ) => {
    if (feature.geometry.type === "Point") {
      layer.on("click", () => {
        const eventData = feature.properties as DisasterEvent;
        if (!eventData) return;
        onSelectEvent(eventData);

        // Zoom to polygon if available, else zoom to marker
        if (highlightedPolygonRef.current) {
          // Remove old highlight
          mapRef.current?.removeLayer(highlightedPolygonRef.current);
          highlightedPolygonRef.current = null;
        }

        // Find corresponding polygon in GeoJSON for this event id
        const polygonFeature = geojson.features.find(
          (f) =>
            f.properties.id === eventData.id &&
            (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")
        );

        if (polygonFeature && mapRef.current) {
          const polygonLayer = L.geoJSON(polygonFeature.geometry, {
            style: {
              color: "#0033cc",
              weight: 3,
              fillColor: "#0033cc",
              fillOpacity: 0.3,
            },
          }).addTo(mapRef.current);

          polygonLayer.bringToFront();
          highlightedPolygonRef.current = polygonLayer;

          mapRef.current.fitBounds(polygonLayer.getBounds(), {
            maxZoom: 12,
            padding: [50, 50],
          });
        } else {
          // Zoom to marker
          const coords = (feature.geometry as GeoJSON.Point).coordinates;
          mapRef.current?.setView([coords[1], coords[0]], 10);
        }
      });
    }
  };

  return (
    <MapContainer
      center={[21.9162, 95.956]}
      zoom={6}
      scrollWheelZoom
      style={{ height: "600px", width: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON
        data={geojson as any}
        style={styleFunction}
        onEachFeature={onEachFeature}
        pointToLayer={(feature, latlng) =>
          L.circleMarker(latlng, styleFunction(feature as any))
        }
      />
      {/* Add zoom control at top right*/}
      <L.Control.Zoom position="topright" />
    </MapContainer>
  );
};

const ListView = ({
  events,
}: {
  events: DisasterEvent[];
}) => (
  <div className="max-w-4xl mx-auto space-y-6">
    {events.map((event) => (
      <div
        key={event.id}
        className="bg-white shadow rounded p-4 border border-gray-300"
      >
        <h3 className="text-xl font-semibold text-blue-900 mb-1">
          {event.name} ({event.year})
        </h3>
        <p className="mb-2 text-gray-700">{event.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
          {event.impacts.map((impact, i) => (
            <div key={i}>
              <span className="font-semibold">{impact.type}:</span> {impact.value}
              {impact.objectName ? ` (${impact.objectName})` : ""}
            </div>
          ))}
        </div>
        {event.reportPhotos && event.reportPhotos.length > 0 && (
          <p className="mt-2 italic text-sm text-gray-500">
            {event.reportPhotos.length} photo/video{event.reportPhotos.length > 1 ? "s" : ""} available.
          </p>
        )}
      </div>
    ))}
  </div>
);

export default function DisasterDashboard() {
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);

  // Extract disaster events from GeoJSON properties uniquely (for list view)
  // Deduplicate by id, picking just one per unique disaster event
  const uniqueEvents = React.useMemo(() => {
    const map = new Map<number, DisasterEvent>();
    for (const feature of sampleGeoJSONData.features) {
      const event = feature.properties;
      if (!map.has(event.id)) map.set(event.id, event);
    }
    return Array.from(map.values());
  }, [sampleGeoJSONData]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Disaster Events in Myanmar (2015 - 2025)</h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setView("map")}
          className={`px-4 py-2 rounded ${
            view === "map" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-pressed={view === "map"}
        >
          Map View
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${
            view === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-pressed={view === "list"}
        >
          Data List View
        </button>
      </div>

      <p className="mb-6 text-lg font-semibold">
        Total Disaster Events: <span className="text-red-600 font-bold">{uniqueEvents.length}</span>
      </p>

      {view === "map" ? (
        <MapView geojson={sampleGeoJSONData} onSelectEvent={setSelectedEvent} />
      ) : (
        <ListView events={uniqueEvents} />
      )}

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
