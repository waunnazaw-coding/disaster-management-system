"use client";

import React, { ReactNode, useState, useEffect } from "react";
import MapNavbar from "./MapNavbar";
import MapView from "@/Map/DisasterEventMap";
import { getAllDisasterEvents, DisasterEvent } from "@/api/disasterEventApi";

export interface Filters {
  disasterType: string;
  status: string;
  startDate: string;
  searchQuery: string;
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
    searchQuery: "",
  });

  const [events, setEvents] = useState<DisasterEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllDisasterEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-82px)]" style={{ margin: "-25px" }}>
      <MapNavbar
        filters={filters}
        setFilters={setFilters}
        events={events} // pass events for autocomplete
      />

      <div className="flex flex-1">
        <main className="flex-1 relative">
          <div className="absolute inset-0">
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
