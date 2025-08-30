"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Geometry from "ol/geom/Geometry";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { Style, Stroke, Fill } from "ol/style";
import { Filters } from "@/Map/MapLayout";
import { getAllForMapViewEvent, DisasterEvent } from "@/api/disasterEventApi";
import { getFeaturesCentroid } from "@/utils/geoUtils";
import { useNavigate } from "react-router-dom";

interface MapViewProps {
  filters: Filters;
}

const MAPTILER_KEY = "YrtFyZTTaE2cewEtIi2z";
const MAP_STYLE_URL = {
  Mierune: `https://api.maptiler.com/maps/jp-mierune-streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
};

const DEFAULT_CENTER = fromLonLat([96.1, 16]);
const DEFAULT_ZOOM = 5.3;
const FOCUSED_ZOOM = 12;

const MapViewPublic: React.FC<MapViewProps> = ({ filters }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const overlaysRef = useRef<Overlay[]>([]);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let data = await getAllForMapViewEvent();

        // Add console logs to debug
        console.log("All events:", data);
        console.log("Current filters:", filters);

        // Filter by disaster type
        if (filters.disasterType) {
          data = data.filter(e => e.disasterTypeName === filters.disasterType);
        }

        // Filter by status
        if (filters.status) {
          data = data.filter(e => e.status === filters.status);
        }

        // Filter by start date
        if (filters.startDate) {
          data = data.filter(e => {
            console.log("Comparing dates:", e.startDate, "===", filters.startDate);
            return e.startDate === filters.startDate;
          });
        }

        // Filter by search query - THIS WAS MISSING!
        if (filters.searchQuery) {
          data = data.filter(e => 
            e.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            (e.description && e.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
            e.disasterTypeName.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );
        }

        console.log("Filtered events:", data);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, [filters]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: MAP_STYLE_URL.Mierune,
            attributions: '© MapTiler © OpenStreetMap contributors'
          })
        })
      ],
      view: new View({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, enableRotation: false }),
      controls: [],
    });
    setMapInstance(map);
    return () => map.setTarget(undefined);
  }, []);

  // Calculate optimal zoom
  const calculateOptimalZoom = (event: DisasterEvent): { zoom: number; center: number[] } => {
    if (!mapInstance || !event.locationGeoJson) return { zoom: FOCUSED_ZOOM, center: [0, 0] };
    try {
      const geoJsonObj = JSON.parse(event.locationGeoJson);
      const features = new GeoJSON().readFeatures(geoJsonObj, { featureProjection: "EPSG:3857" });
      if (!features.length) return { zoom: FOCUSED_ZOOM, center: [0, 0] };

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      features.forEach(f => {
        const e = f.getGeometry()?.getExtent();
        if (e) { minX = Math.min(minX, e[0]); minY = Math.min(minY, e[1]); maxX = Math.max(maxX, e[2]); maxY = Math.max(maxY, e[3]); }
      });
      if (!isFinite(minX)) return { zoom: FOCUSED_ZOOM, center: [0, 0] };

      const center = [(minX + maxX) / 2, (minY + maxY) / 2];
      const width = maxX - minX, height = maxY - minY;

      const mapSize = mapInstance.getSize();
      if (!mapSize) return { zoom: FOCUSED_ZOOM, center };

      const resolution = Math.max((width * 1.3) / mapSize[0], (height * 1.3) / mapSize[1]);
      const zoom = mapInstance.getView().getZoomForResolution(resolution);
      return { zoom: Math.max(6, Math.min(18, zoom || FOCUSED_ZOOM)), center };
    } catch {
      return { zoom: FOCUSED_ZOOM, center: [0, 0] };
    }
  };

  // Close modal
  const closeModal = (overlay?: Overlay) => {
    if (!mapInstance) return;
    if (overlay) mapInstance.removeOverlay(overlay);
    if (vectorLayerRef.current) { mapInstance.removeLayer(vectorLayerRef.current); vectorLayerRef.current = null; }
    mapInstance.getView().animate({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 500 });
    setSelectedEvent(null);
  };

  // Show modal & area
  const showModalAndArea = (
    event: DisasterEvent,
    position: number[],
    mapInstance: any,
    vectorLayerRef: React.MutableRefObject<any>,
    closeModal: (overlay: Overlay) => void,
    navigate: ReturnType<typeof useNavigate>
  ) => {
    if (!mapInstance) return;

    const modalElement = document.createElement("div");
    modalElement.className =
      "bg-white rounded-lg shadow-2xl border-2 border-gray-200 overflow-hidden";
    modalElement.style.minWidth = "320px";
    modalElement.style.maxWidth = "400px";

    modalElement.innerHTML = `
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex flex-col justify-between items-start">
      <div class="flex justify-between w-full">
        <h3 class="text-lg font-bold mb-3 leading-tight">${event.name || "Disaster Event"}</h3>
        <button class="close-modal-btn text-white hover:text-gray-200 flex-shrink-0 transition-colors" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div>
        <span class="px-1 py-1 ${event.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} rounded-full text-xs font-medium">${event.status || "CaseClosed"}</span>
        <span class="px-1 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">${event.disasterTypeName || "Unknown"}</span>
        <span class="px-1 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">${event.severity || "-"}</span>
      </div>
    </div>
    <div class="p-2 space-y-3">
      ${event.description ? `
        <p class="text-gray-700 text-sm leading-relaxed indent-5 bg-gray-50 rounded-lg line-clamp-2">
          ${event.description}
          <button class="read-more-btn text-blue-500 hover:underline ml-1" data-id="${event.id}">Read more...</button>
        </p>` : ""
      }
      <div class="flex items-center justify-between text-xs text-blue-500">
        <div class="flex gap-1">
          <div class="w-8 h-9 bg-blue-600 rounded-b-full flex items-center justify-center shadow ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
            </svg>
          </div>
          <div class="font-semibold">
            <div class="text-sm text-blue-800">${event.createdUserName}</div>
            <span class="text-xs text-gray-500">${event.createdAt ? new Date(event.createdAt).toLocaleString() : "N/A"}</span>
          </div>
        </div>

        <div class="relative group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
          </svg>
          <div class="absolute -top-6 right-0 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition">Save</div>
        </div>
      </div>
    </div>
  `;

    // Close modal button
    modalElement.querySelector(".close-modal-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal(overlayInstance);
    });

    // Stop clicks inside modal from bubbling
    modalElement.addEventListener("click", (e) => e.stopPropagation());

    const overlayInstance = new Overlay({
      element: modalElement,
      position,
      positioning: "bottom-center",
      stopEvent: true,
      offset: [10, -15],
      autoPan: { animation: { duration: 250 } },
    });

    mapInstance.addOverlay(overlayInstance);

    // Navigate handler for Read More
    const readMoreBtn = modalElement.querySelector<HTMLButtonElement>(".read-more-btn");
    if (readMoreBtn) {
      readMoreBtn.addEventListener("click", () => {
        const id = readMoreBtn.dataset.id;
        if (id) navigate(`/disasters/${id}`);
      });
    }

    // Show disaster area
    if (event.locationGeoJson) {
      if (vectorLayerRef.current) mapInstance.removeLayer(vectorLayerRef.current);

      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({ color: "#DC2626", width: 3 }),
          fill: new Fill({ color: "rgba(220, 38, 38, 0.25)" }),
        }),
        zIndex: 1,
      });

      try {
        const features = new GeoJSON().readFeatures(JSON.parse(event.locationGeoJson), {
          featureProjection: "EPSG:3857",
        });
        vectorSource.addFeatures(features);
        mapInstance.addLayer(vectorLayer);
        vectorLayerRef.current = vectorLayer;
      } catch {
        console.error("Failed to parse GeoJSON");
      }
    }
  };

  // Pin click
  const handlePinClick = (event: DisasterEvent, position: number[]) => {
    if (!mapInstance) return;
    if (selectedEvent?.id === event.id) { closeModal(); return; }
    setSelectedEvent(event);

    const { zoom, center } = calculateOptimalZoom(event);
    const targetCenter = center[0] !== 0 && center[1] !== 0 ? center : position;

    mapInstance.getView().animate({
      center: targetCenter,
      zoom,
      duration: 800,
      easing: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    });

    setTimeout(() =>
      showModalAndArea(
        event,
        position,
        mapInstance,
        vectorLayerRef,
        closeModal,
        navigate
      ),
      400
    );

  };

  // Add pins
  useEffect(() => {
    if (!mapInstance) return;
    overlaysRef.current.forEach(o => mapInstance.removeOverlay(o));
    overlaysRef.current = [];

    events.forEach(event => {
      if (!event.locationGeoJson) return;
      let geoJsonObj;
      try { geoJsonObj = JSON.parse(event.locationGeoJson); } catch { return; }
      const features = new GeoJSON().readFeatures(geoJsonObj, { featureProjection: "EPSG:3857" });
      if (!features.length) return;

      const geometries = features.map(f => f.getGeometry()).filter((g): g is Geometry => !!g);
      if (!geometries.length) return;

      const pos = getFeaturesCentroid(geometries);
      const el = document.createElement("div");
      el.style.cssText = "position:absolute;cursor:pointer;width:32px;height:32px;transform:translate(-50%,-100%);transition:all 0.2s ease;z-index:100;";
      el.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#DC2626"/><circle cx="12" cy="9" r="3" fill="white"/></svg>`;
      el.addEventListener('click', e => { e.stopPropagation(); if (!selectedEvent) handlePinClick(event, pos); });
      el.addEventListener('mouseenter', () => { if (!selectedEvent) { el.style.transform = "translate(-50%,-100%) scale(1.1)"; el.style.zIndex = "200"; } });
      el.addEventListener('mouseleave', () => { if (!selectedEvent) { el.style.transform = "translate(-50%,-100%) scale(1)"; el.style.zIndex = "100"; } });

      const overlay = new Overlay({ element: el, position: pos, positioning: "bottom-center", stopEvent: false });
      mapInstance.addOverlay(overlay);
      overlaysRef.current.push(overlay);
    });

  }, [mapInstance, events, selectedEvent]);

  // Click outside modal
  useEffect(() => {
    if (!mapInstance) return;
    const handleClick = (e: any) => {
      if (!selectedEvent) return;
      const pixel = mapInstance.getEventPixel(e.originalEvent);
      const features = mapInstance.getFeaturesAtPixel(pixel);
      const isClickOnModal = e.originalEvent.target.closest('.bg-white.rounded-lg.shadow-2xl');
      if (features.length === 0 && !isClickOnModal) closeModal();
    };
    mapInstance.on('singleclick', handleClick);
    return () => mapInstance.un('singleclick', handleClick);
  }, [mapInstance, selectedEvent]);

  // ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return <div className="relative w-full h-full"><div ref={mapRef} className="w-full h-full" /></div>;
};


export default MapViewPublic;