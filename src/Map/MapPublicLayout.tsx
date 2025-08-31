"use client";

import React, { ReactNode, useState, useEffect } from "react";
import MapNavbar from "./MapNavbar";
import { getAllDisasterEvents, DisasterEvent } from "@/api/disasterEventApi";
import MapViewPublic from "./DisasterEventMapPublic";

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

const MapPublicLayout: React.FC<MapLayoutProps> = ({ children, controls }) => {
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
    <div className="flex flex-col h-[calc(100vh-82px)]">
      <MapNavbar
        filters={filters}
        setFilters={setFilters}
        events={events} // pass events for autocomplete
      />

      <div className="flex flex-1">
        <main className="flex-1 relative">
          <div className="absolute inset-0">
            <MapViewPublic filters={filters} />
          </div>

          {controls && <div className="absolute top-4 right-4 z-50">{controls}</div>}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MapPublicLayout;
