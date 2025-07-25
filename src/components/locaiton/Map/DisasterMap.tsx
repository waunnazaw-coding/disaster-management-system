import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { defaults as defaultControls } from "ol/control";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import PointGeom from "ol/geom/Point";
import PolygonGeom from "ol/geom/Polygon";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Geocoder from "ol-geocoder";
import "ol-geocoder/dist/ol-geocoder.min.css";
import MapToolbar from "./MapToolbar";
import MapContainer from "./MapContainer";
import "../../../styles/map.css";
import Zoom from "ol/control/Zoom";

interface MapProps {
  geojsonData?: any;
  onChangeGeojson?: (geojson: any) => void;
  viewOnly?: boolean;
}

const MAPTILER_KEY = "YrtFyZTTaE2cewEtIi2z";

const MAP_STYLES = {
  hybrid: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
  streets: `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  basic: `https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  topo: `https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
};

const MIN_VISIBLE_SIZE = 30; // minimum pixel size of polygon extent to be visible
const CLUSTER_DISTANCE_THRESHOLD = 40; // pixels, distance to cluster features

const DisasterMap: React.FC<MapProps> = ({ geojsonData, onChangeGeojson, viewOnly = false }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);

  const tileLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const markerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  const [selectedStyle, setSelectedStyle] = useState<keyof typeof MAP_STYLES>("hybrid");
  const [drawType, setDrawType] = useState<"Point" | "Polygon" | null>(null);

  const drawRef = useRef<Draw | null>(null);
  const modifyRef = useRef<Modify | null>(null);
  const selectRef = useRef<Select | null>(null);

  const searchMarkerRef = useRef<Feature<Point> | null>(null);

  // Flag to prevent recursive updates during loading from props
  const isLoading = useRef(false);

  // Update geojson and notify parent
  const updateGeojson = () => {
    if (!vectorSourceRef.current || !onChangeGeojson) return;
    if (isLoading.current) return; // Skip update during loading sync

    const features = vectorSourceRef.current.getFeatures();
    const geojson = new GeoJSON().writeFeaturesObject(features, { featureProjection: "EPSG:3857" });
    onChangeGeojson(geojson);
  };

  // Calculate pixel distance between two coords on screen
  const pixelDistance = (coord1: number[], coord2: number[]) => {
    if (!mapInstance.current) return Infinity;
    const px1 = mapInstance.current.getPixelFromCoordinate(coord1);
    const px2 = mapInstance.current.getPixelFromCoordinate(coord2);
    if (!px1 || !px2) return Infinity;
    return Math.sqrt((px1[0] - px2[0]) ** 2 + (px1[1] - px2[1]) ** 2);
  };

  // Zoom and center on given features
  const zoomToFeatures = (features: Feature[]) => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();

    let combinedExtent: number[] | null = null;
    features.forEach((feature) => {
      const geom = feature.getGeometry();
      if (!geom) return;
      const extent = geom.getExtent();
      if (!combinedExtent) combinedExtent = extent.slice();
      else {
        combinedExtent[0] = Math.min(combinedExtent[0], extent[0]);
        combinedExtent[1] = Math.min(combinedExtent[1], extent[1]);
        combinedExtent[2] = Math.max(combinedExtent[2], extent[2]);
        combinedExtent[3] = Math.max(combinedExtent[3], extent[3]);
      }
    });

    if (combinedExtent) {
      view.fit(combinedExtent, { padding: [50, 50, 50, 50], maxZoom: 16 });
    }
  };

  // Update cluster and small polygon center markers
  const updateClusterMarkers = () => {
    if (!vectorSourceRef.current || !markerLayerRef.current || !mapInstance.current) return;

    const markerSource = markerLayerRef.current.getSource();
    if (!markerSource) return;

    markerSource.clear();

    const features = vectorSourceRef.current.getFeatures();
    const map = mapInstance.current;

    const clusters: { coord: number[]; features: Feature[] }[] = [];

    const featureCoords = features
      .map((feature) => {
        const geom = feature.getGeometry();
        if (!geom) return null;

        let coord: number[] | null = null;
        let isSmallPolygon = false;

        if (geom.getType() === "Point") {
          coord = (geom as PointGeom).getCoordinates();
        } else if (geom.getType() === "Polygon") {
          const polygonGeom = geom as PolygonGeom;
          coord = polygonGeom.getInteriorPoint().getCoordinates();

          const extent = polygonGeom.getExtent();
          const pixelTopLeft = map.getPixelFromCoordinate([extent[0], extent[3]]);
          const pixelBottomRight = map.getPixelFromCoordinate([extent[2], extent[1]]);
          if (pixelTopLeft && pixelBottomRight) {
            const widthPx = Math.abs(pixelBottomRight[0] - pixelTopLeft[0]);
            const heightPx = Math.abs(pixelBottomRight[1] - pixelTopLeft[1]);
            if (widthPx < MIN_VISIBLE_SIZE && heightPx < MIN_VISIBLE_SIZE) {
              isSmallPolygon = true;
            }
          }
        } else {
          return null;
        }
        return { feature, coord, isSmallPolygon };
      })
      .filter((f) => f !== null) as { feature: Feature; coord: number[]; isSmallPolygon: boolean }[];

    featureCoords.forEach(({ feature, coord, isSmallPolygon }) => {
      if (isSmallPolygon) {
        return; // skip for clustering
      }
      const cluster = clusters.find((c) => pixelDistance(c.coord, coord) < CLUSTER_DISTANCE_THRESHOLD);

      if (cluster) {
        cluster.features.push(feature);
        cluster.coord = [
          (cluster.coord[0] * (cluster.features.length - 1) + coord[0]) / cluster.features.length,
          (cluster.coord[1] * (cluster.features.length - 1) + coord[1]) / cluster.features.length,
        ];
      } else {
        clusters.push({ coord: coord.slice(), features: [feature] });
      }
    });

    // Add cluster markers
    clusters.forEach((cluster) => {
      if (cluster.features.length > 1) {
        const markerFeature = new Feature(new Point(cluster.coord));
        markerFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 10,
              fill: new Fill({ color: "rgba(0, 150, 255, 0.7)" }),
              stroke: new Stroke({ color: "blue", width: 2 }),
            }),
          })
        );
        (markerFeature as any).clusterFeatures = cluster.features;
        markerSource.addFeature(markerFeature);
      }
    });

    // Add green point markers for small polygons
    featureCoords.forEach(({ feature, coord, isSmallPolygon }) => {
      if (isSmallPolygon) {
        const smallPolyMarker = new Feature(new Point(coord));
        smallPolyMarker.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 8,
              fill: new Fill({ color: "rgba(0, 200, 0, 0.7)" }),
              stroke: new Stroke({ color: "darkgreen", width: 2 }),
            }),
          })
        );
        (smallPolyMarker as any).linkedFeature = feature;
        markerSource.addFeature(smallPolyMarker);
      }
    });
  };

  // Handle click on markers (cluster or small polygon points)
  const onMapClick = (evt: any) => {
    if (!markerLayerRef.current || !mapInstance.current) return;
    const pixel = evt.pixel;
    const features = mapInstance.current.getFeaturesAtPixel(pixel) || [];

    for (const feature of features) {
      const clusterFeatures = (feature as any).clusterFeatures as Feature[] | undefined;
      const linkedFeature = (feature as any).linkedFeature as Feature | undefined;

      if (clusterFeatures) {
        zoomToFeatures(clusterFeatures);
        return;
      }

      if (linkedFeature) {
        zoomToFeatures([linkedFeature]);
        return;
      }
    }
  };

  // Clear all features & markers
  const clearAll = () => {
    vectorSourceRef.current?.clear();
    markerLayerRef.current?.getSource()?.clear();
    searchMarkerRef.current = null;
    updateGeojson();
  };

  // Initialize map and layers
  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const markerSource = new VectorSource();
    markerLayerRef.current = new VectorLayer({
      source: markerSource,
      style: null,
    });

    tileLayerRef.current = new TileLayer({
      source: new XYZ({ url: MAP_STYLES[selectedStyle], tileSize: 512, maxZoom: 20 }),
    });

    const vectorLayer = new VectorLayer({ source: vectorSource });

    const zoomControl = new Zoom({
      className: "custom-zoom",
      zoomInLabel: "+",
      zoomOutLabel: "−",
      zoomInTipLabel: "Zoom in",
      zoomOutTipLabel: "Zoom out",
    });

    const map = new Map({
      target: mapRef.current,
      layers: [tileLayerRef.current, vectorLayer, markerLayerRef.current],
      view: new View({ center: [0, 0], zoom: 2 }),
      controls: defaultControls({ zoom: false, rotate: false }).extend([zoomControl]),
    });
    mapInstance.current = map;

    // Add geocoder
    const geocoder = new Geocoder("nominatim", {
      provider: "osm",
      autoComplete: true,
      placeholder: "Search location...",
      targetType: "input",
      limit: 7,
    });
    map.addControl(geocoder);

    setTimeout(() => {
      const button = document.querySelector(".ol-geocoder .gcd-gl-btn");
      if (button) {
        button.remove();
      }
    }, 0);

    geocoder.on("addresschosen", (evt: any) => {
      const coordinate = evt.coordinate;
      const markerSource = markerLayerRef.current?.getSource();
      if (!markerSource) return;

      if (searchMarkerRef.current) {
        markerSource.removeFeature(searchMarkerRef.current);
        searchMarkerRef.current = null;
      }

      const newMarker = new Feature(new Point(coordinate));
      newMarker.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: "rgba(0, 200, 0, 0.6)" }),
            stroke: new Stroke({ color: "green", width: 2 }),
          }),
        })
      );

      markerSource.addFeature(newMarker);
      searchMarkerRef.current = newMarker;

      map.getView().animate({ center: coordinate, zoom: 12 });
    });

    if (!viewOnly) {
      // Add addfeature listener with isLoading check
      const onAddFeature = () => {
        if (!isLoading.current) {
          updateGeojson();
          updateClusterMarkers();
        }
      };

      vectorSource.on("addfeature", onAddFeature);

      const modify = new Modify({ source: vectorSource });
      map.addInteraction(modify);
      modifyRef.current = modify;

      const select = new Select({ condition: click, hitTolerance: 20 });
      map.addInteraction(select);
      selectRef.current = select;

      const deleteFeature = () => {
        const selected = select.getFeatures();
        selected.forEach((f) => vectorSource.removeFeature(f));
        selected.clear();
        updateGeojson();
        updateClusterMarkers();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          deleteFeature();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Map click handler for zoom on cluster/small polygon points
      map.on("click", onMapClick);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        map.un("click", onMapClick);
        vectorSource.un("addfeature", onAddFeature);
        map.setTarget(undefined);
      };
    } else {
      return () => {
        map.setTarget(undefined);
      };
    }
  }, [viewOnly, selectedStyle]);

  // Load and fit geojson features, with isLoading flag to prevent update loops
  useEffect(() => {
    if (!vectorSourceRef.current || !mapInstance.current) return;

    isLoading.current = true;
    vectorSourceRef.current.clear();
    markerLayerRef.current?.getSource()?.clear();
    searchMarkerRef.current = null;

    if (geojsonData) {
      const features = new GeoJSON().readFeatures(geojsonData, { featureProjection: "EPSG:3857" });
      vectorSourceRef.current.addFeatures(features);

      const extent = vectorSourceRef.current.getExtent();
      if (geojsonData.features?.length > 0) {
        mapInstance.current.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 16 });
        updateClusterMarkers();
      }
    }

    setTimeout(() => {
      isLoading.current = false;
    }, 0);
  }, [geojsonData]);

  // Update tile layer source when style changes
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setSource(new XYZ({ url: MAP_STYLES[selectedStyle], tileSize: 512, maxZoom: 20 }));
    }
  }, [selectedStyle]);

  // Manage draw interaction
  useEffect(() => {
    if (!mapInstance.current || !vectorSourceRef.current) return;

    if (drawRef.current) {
      mapInstance.current.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    if (!viewOnly && drawType) {
      const draw = new Draw({ source: vectorSourceRef.current, type: drawType });
      draw.on("drawend", () => {
        updateGeojson();
        updateClusterMarkers();
      });
      mapInstance.current.addInteraction(draw);
      drawRef.current = draw;
    }
  }, [drawType, viewOnly]);

  // Re-check markers on zoom/resolution change
  useEffect(() => {
    if (!mapInstance.current) return;

    const view = mapInstance.current.getView();
    const onResolutionChange = () => {
      updateClusterMarkers();
    };
    view.on("change:resolution", onResolutionChange);

    return () => {
      view.un("change:resolution", onResolutionChange);
    };
  }, []);

  return (
    <>
      {!viewOnly && (
        <MapToolbar
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          drawType={drawType}
          setDrawType={setDrawType}
          clearAll={clearAll}
          mapStyles={MAP_STYLES}
        />
      )}
      <MapContainer mapRef={mapRef} />
    </>
  );
};

export default DisasterMap;
