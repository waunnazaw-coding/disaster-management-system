// utils/geoUtil.ts
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import MultiPolygon from "ol/geom/MultiPolygon";
import { getCenter } from "ol/extent";

/**
 * Returns a single [x, y] coordinate representing the centroid of a geometry.
 * Supports Point, Polygon, MultiPolygon, and other geometries as fallback.
 */
export function getGeometryCentroid(geom: Geometry): Coordinate {
  if (!geom) return [0, 0];

  if (geom instanceof Point) {
    return geom.getCoordinates();
  } else if (geom instanceof Polygon) {
    return geom.getInteriorPoint().getCoordinates();
  } else if (geom instanceof MultiPolygon) {
    const polygons = geom.getPolygons();
    const coords = polygons.map(p => p.getInteriorPoint().getCoordinates());
    const x = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const y = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
    return [x, y];
  } else {
    // fallback for other geometry types
    return getCenter(geom.getExtent());
  }
}

/**
 * Returns a single [x, y] coordinate representing the centroid of multiple geometries.
 */
export function getFeaturesCentroid(geoms: Geometry[]): Coordinate {
  const coords: Coordinate[] = [];

  geoms.forEach(geom => {
    if (geom) coords.push(getGeometryCentroid(geom));
  });

  if (!coords.length) return [0, 0];

  const x = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
  const y = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

  return [x, y];
}
