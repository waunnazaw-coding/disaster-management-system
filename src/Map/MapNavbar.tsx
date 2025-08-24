"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Filters } from "./MapLayout";
import { format } from "date-fns";
import { CalendarIcon, Shield } from "lucide-react";

const disasterTypes = [
  "Earthquake",
  "Flood",
  "Hurricane",
  "Tornado",
  "Wildfire",
  "Landslide",
  "Volcanic Eruption",
  "Drought",
  "Pandemic",
  "Chemical Spill",
  "Nuclear Accident",
  "Cyber Attack",
  "Terrorism",
  "Industrial Accident",
];

interface MapNavbarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const MapNavbar: React.FC<MapNavbarProps> = ({ filters, setFilters }) => {
  const [date, setDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );

  const handleChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      handleChange("startDate", formattedDate);
    } else {
      handleChange("startDate", "");
    }
  };

  const handleClear = () => {
    setFilters({ disasterType: "", status: "", startDate: "" });
    setDate(undefined);
  };

  return (
    <header className="h-20 flex items-center gap-10 px-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 shadow-lg backdrop-blur-sm">
      {/* Left Section - Logo/Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
         <Shield/>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Disaster Events</h1>
          <p className="text-xs text-gray-500 font-medium">Real-time monitoring system</p>
        </div>
      </div>

      {/* Center Section - Filters */}
      <div className="flex items-center gap-6 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/50">
        {/* Disaster Type Filter */}
        <div className="relative">
          <Select
            value={filters.disasterType}
            onValueChange={val => handleChange("disasterType", val)}
          >
            <SelectTrigger className="w-[170px] h-10 bg-white border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 rounded-lg shadow-sm">
              <SelectValue placeholder="Disaster Type" className="text-gray-900" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-xl">
              {disasterTypes.map(type => (
                <SelectItem 
                  key={type} 
                  value={type}
                  className="hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors duration-150"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Select
            value={filters.status}
            onValueChange={val => handleChange("status", val)}
          >
            <SelectTrigger className="w-[150px] h-10 bg-white border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 rounded-lg shadow-sm">
              <SelectValue placeholder="Disaster Status" className="text-gray-900" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-xl">
              <SelectItem value="Active" className="hover:bg-green-50 hover:text-green-700 cursor-pointer transition-colors duration-150">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active
                </div>
              </SelectItem>
              <SelectItem value="Closed" className="hover:bg-gray-50 hover:text-gray-700 cursor-pointer transition-colors duration-150">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Case Closed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] h-10 justify-start text-left font-normal bg-white border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 rounded-lg shadow-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM dd, yyyy") : "Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-xl shadow-xl" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear Filters Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClear}
          className="h-10 px-4 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg shadow-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </Button>
      </div>
    </header>
  );
};

export default MapNavbar;