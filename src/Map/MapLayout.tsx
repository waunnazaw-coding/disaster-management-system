"use client";

import React, { ReactNode, useState } from "react";
import MapNavbar from "./MapNavbar";
import MapSidebar from "./MapSidebar";
import MapView from "@/components/disaster/DisasterEventMap";

export interface Filters {
  disasterType: string;
  status: string;
  startDate: string;
}

interface MapLayoutProps {
  children?: ReactNode;
  controls?: ReactNode;
}

const MapLayout: React.FC<MapLayoutProps> = ({ children, controls }) => {
  const [filters, setFilters] = useState<Filters>({
    disasterType: "",
    status: "",
    startDate: "",
  });

  return (
    <div className="flex flex-col h-[calc(100vh-82px)]" style={{ margin: "-25px" }}>
      {/* Pass filters and setFilters to Navbar */}
      <MapNavbar filters={filters} setFilters={setFilters} />

      <div className="flex flex-1">
        <MapSidebar />

        <main className="flex-1 relative">
          <div className="absolute inset-0">
            {/* Pass filters to MapView */}
            <MapView filters={filters} />
          </div>

          {controls && <div className="absolute top-4 right-4 z-50">{controls}</div>}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MapLayout;
