"use client";

import React from "react";
import { MapPin, Home, Settings } from "lucide-react";

const MapSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-100 border-r flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
        Logo
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
          <Home className="w-5 h-5" /> Home
        </a>
        <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
          <MapPin className="w-5 h-5" /> Map
        </a>
        <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200">
          <Settings className="w-5 h-5" /> Settings
        </a>
      </nav>
    </aside>
  );
};

export default MapSidebar;
