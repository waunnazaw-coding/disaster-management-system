import React from "react";

interface MapContainerProps {
    mapRef: React.RefObject<HTMLDivElement | null>;
}

const MapContainer: React.FC<MapContainerProps> = ({ mapRef }) => (
    <div
        ref={mapRef}
        style={{ width: "100%", height: "350px", border: "1px solid black" }}
    />
);

export default MapContainer;
