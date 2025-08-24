// @/utils/geoUtils.ts
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import MultiPolygon from "ol/geom/MultiPolygon";
import LineString from "ol/geom/LineString";
import MultiLineString from "ol/geom/MultiLineString";
import MultiPoint from "ol/geom/MultiPoint";
import { getCenter } from "ol/extent";

/**
 * Calculate the centroid of multiple geometries
 * @param geometries Array of OpenLayers geometries
 * @returns Coordinate array [x, y] representing the centroid
 */
export const getFeaturesCentroid = (geometries: Geometry[]): number[] => {
  if (geometries.length === 0) {
    return [0, 0];
  }

  if (geometries.length === 1) {
    return getGeometryCentroid(geometries[0]);
  }

  // Calculate centroid from multiple geometries
  let totalX = 0;
  let totalY = 0;
  let validGeometries = 0;

  geometries.forEach(geometry => {
    const centroid = getGeometryCentroid(geometry);
    if (centroid) {
      totalX += centroid[0];
      totalY += centroid[1];
      validGeometries++;
    }
  });

  if (validGeometries === 0) {
    return [0, 0];
  }

  return [totalX / validGeometries, totalY / validGeometries];
};

/**
 * Calculate the centroid of a single geometry
 * @param geometry OpenLayers geometry
 * @returns Coordinate array [x, y] representing the centroid
 */
export const getGeometryCentroid = (geometry: Geometry): number[] => {
  const geometryType = geometry.getType();

  switch (geometryType) {
    case 'Point':
      const point = geometry as Point;
      return point.getCoordinates();

    case 'LineString':
      const lineString = geometry as LineString;
      const coordinates = lineString.getCoordinates();
      return calculateLineStringCentroid(coordinates);

    case 'Polygon':
      const polygon = geometry as Polygon;
      return getCenter(polygon.getExtent());

    case 'MultiPoint':
      const multiPoint = geometry as MultiPoint;
      const points = multiPoint.getCoordinates();
      return calculateMultiPointCentroid(points);

    case 'MultiLineString':
      const multiLineString = geometry as MultiLineString;
      const lines = multiLineString.getCoordinates();
      return calculateMultiLineStringCentroid(lines);

    case 'MultiPolygon':
      const multiPolygon = geometry as MultiPolygon;
      return getCenter(multiPolygon.getExtent());

    default:
      // Fallback to extent center
      return getCenter(geometry.getExtent());
  }
};

/**
 * Calculate centroid of a LineString
 */
const calculateLineStringCentroid = (coordinates: number[][]): number[] => {
  if (coordinates.length === 0) return [0, 0];
  if (coordinates.length === 1) return coordinates[0];

  let totalX = 0;
  let totalY = 0;
  
  coordinates.forEach(coord => {
    totalX += coord[0];
    totalY += coord[1];
  });

  return [totalX / coordinates.length, totalY / coordinates.length];
};

/**
 * Calculate centroid of multiple points
 */
const calculateMultiPointCentroid = (points: number[][]): number[] => {
  if (points.length === 0) return [0, 0];
  
  let totalX = 0;
  let totalY = 0;
  
  points.forEach(point => {
    totalX += point[0];
    totalY += point[1];
  });

  return [totalX / points.length, totalY / points.length];
};

/**
 * Calculate centroid of multiple line strings
 */
const calculateMultiLineStringCentroid = (lines: number[][][]): number[] => {
  if (lines.length === 0) return [0, 0];
  
  let totalX = 0;
  let totalY = 0;
  let totalPoints = 0;

  lines.forEach(line => {
    line.forEach(point => {
      totalX += point[0];
      totalY += point[1];
      totalPoints++;
    });
  });

  if (totalPoints === 0) return [0, 0];
  
  return [totalX / totalPoints, totalY / totalPoints];
};