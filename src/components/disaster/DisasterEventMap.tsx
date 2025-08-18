"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { Style, Stroke, Fill } from "ol/style";
import { getAllActiveDisasterEvents, DisasterEvent } from "@/api/disasterEventApi";
import { getFeaturesCentroid } from "@/utils/geoUnils";
import { Geometry } from "ol/geom";

const MAPTILER_KEY = "YrtFyZTTaE2cewEtIi2z";

const MAP_STYLE_URL = {
  Mierune: `https://api.maptiler.com/maps/jp-mierune-streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  setellite: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
  streets: `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  basic: `https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  topo: `https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
};

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const overlaysRef = useRef<Overlay[]>([]);
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof MAP_STYLE_URL>("Mierune");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getAllActiveDisasterEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const tileLayer = new TileLayer({
      source: new XYZ({ url: MAP_STYLE_URL[selectedStyle], tileSize: 512, maxZoom: 20 }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [tileLayer],
      view: new View({ center: fromLonLat([96.1, 16]), zoom: 5.3 }),
    });

    setMapInstance(map);

    return () => map.setTarget(undefined);
  }, []);

  // Update tile layer when style changes
  useEffect(() => {
    if (!mapInstance) return;

    const layers = mapInstance.getLayers().getArray();
    const oldTileLayer = layers[0] as TileLayer<XYZ>;
    mapInstance.removeLayer(oldTileLayer);

    const newTileLayer = new TileLayer({
      source: new XYZ({ url: MAP_STYLE_URL[selectedStyle], tileSize: 512, maxZoom: 20 }),
    });
    mapInstance.getLayers().insertAt(0, newTileLayer);
  }, [selectedStyle, mapInstance]);

  // Map overlays for events (your existing code)
  useEffect(() => {
    if (!mapInstance) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: feature => {
        const geom = feature.getGeometry();
        if (geom?.getType() === "Polygon") {
          return new Style({
            stroke: new Stroke({ color: "red", width: 2 }),
            fill: new Fill({ color: "rgba(255,0,0,0.2)" }),
          });
        }
        return undefined;
      }
    });
    mapInstance.addLayer(vectorLayer);

    let polygonAppearedZoom: number | null = null;
    const zoomThresholdOffset = 2;
    const view = mapInstance.getView();

    events.forEach(event => {
      if (!event.locationGeoJson) return;

      let geoJsonObj;
      try {
        geoJsonObj = JSON.parse(event.locationGeoJson);
      } catch {
        return;
      }

      const features = new GeoJSON().readFeatures(geoJsonObj, { featureProjection: "EPSG:3857" });
      if (!features.length) return;

      const geometries = features.map(f => f.getGeometry()).filter((g): g is Geometry => g !== undefined);
      if (!geometries.length) return;

      const overlayPosition = getFeaturesCentroid(geometries);

      const overlayEl = document.createElement("div");
      overlayEl.style.position = "absolute";
      overlayEl.style.cursor = "pointer";
      overlayEl.style.width = "20px";
      overlayEl.style.height = "20px";
      overlayEl.style.transform = "translate(-50%, -50%)";
      overlayEl.style.pointerEvents = "auto";
      overlayEl.innerHTML = `
<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#D51D1D"/>
  <circle cx="12" cy="9" r="3" fill="white"/>
</svg>
`;

      overlayEl.addEventListener("click", () => {
        vectorSource.clear();
        features.forEach(f => vectorSource.addFeature(f));
        const geom = geometries[0];
        if (!geom) return;
        view.fit(geom.getExtent(), { padding: [50, 50, 50, 50], maxZoom: 15, duration: 1000 });
        let opacity = 0;
        const interval = setInterval(() => {
          opacity += 0.05;
          if (opacity >= 0.2) { opacity = 0.2; clearInterval(interval); }
          vectorLayer.setStyle(f => new Style({ stroke: new Stroke({ color: "red", width: 2 }), fill: new Fill({ color: `rgba(255,0,0,${opacity})` }) }));
        }, 50);
      });

      const overlay = new Overlay({ element: overlayEl, position: overlayPosition, positioning: "center-center" });
      mapInstance.addOverlay(overlay);
      overlaysRef.current.push(overlay);
    });

    return () => {
      mapInstance.removeLayer(vectorLayer);
      overlaysRef.current.forEach(o => mapInstance.removeOverlay(o));
      overlaysRef.current = [];
    };
  }, [mapInstance, events]);

  // --- SEARCH FUNCTION ---
  const handleSearch = async () => {
    if (!searchQuery || !mapInstance) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();
      if (results.length === 0) return;

      const { lon, lat } = results[0];
      const view = mapInstance.getView();
      view.animate({ center: fromLonLat([parseFloat(lon), parseFloat(lat)]), zoom: 14, duration: 1000 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-white">
      {/* Search box */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000, background: "white", padding: "5px 10px", borderRadius: 4 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search location"
          style={{ padding: "2px 5px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: 5, padding: "2px 5px" }}>Go</button>
      </div>

      {/* Map style selector */}
      <div style={{ position: "absolute", top: 50, left: 10, zIndex: 1000, background: "white", padding: "5px 10px", borderRadius: 4 }}>
        <label htmlFor="mapStyle">Map Style: </label>
        <select id="mapStyle" value={selectedStyle} onChange={e => setSelectedStyle(e.target.value as keyof typeof MAP_STYLE_URL)}>
          {Object.keys(MAP_STYLE_URL).map(style => (<option key={style} value={style}>{style}</option>))}
        </select>
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "82vh", position: "relative" }} />
    </section>
  );
};

export default MapView;
