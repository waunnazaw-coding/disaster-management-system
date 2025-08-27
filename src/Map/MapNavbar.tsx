"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Search, Filter, X, MapPin, AlertTriangle } from "lucide-react";
import { DisasterEvent } from "@/api/disasterEventApi";

// ---------------------- Filters type ----------------------
export interface Filters {
  disasterType: string;
  status: string;
  startDate: string;
  searchQuery: string;
}

// ---------------------- Component Props ----------------------
interface MapNavbarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  events: DisasterEvent[];
  onSelectEvent?: (event: DisasterEvent) => void;
}

// ---------------------- Component ----------------------
const MapNavbar: React.FC<MapNavbarProps> = ({ filters, setFilters, events, onSelectEvent }) => {
  const [date, setDate] = useState<Date | undefined>(filters.startDate ? new Date(filters.startDate) : undefined);
  const [searchText, setSearchText] = useState(filters.searchQuery || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    handleChange("startDate", selectedDate ? format(selectedDate, "yyyy-MM-dd") : "");
  };

  const handleClear = () => {
    setFilters({ disasterType: "", status: "", startDate: "", searchQuery: "" });
    setDate(undefined);
    setSearchText("");
  };

  const handleSearch = () => {
    handleChange("searchQuery", searchText);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Autocomplete suggestions
  const suggestions = searchText
    ? events.filter(e => e.name.toLowerCase().includes(searchText.toLowerCase())).slice(0, 5)
    : [];

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <header className="relative h-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px] opacity-30"></div>

      <div className="relative h-full flex items-center justify-center gap-6 px-8">
        {/* Brand */}
        <div className="flex items-center gap-3 mr-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white tracking-tight">Disaster Map</h1>
            <p className="text-xs text-slate-300">Real-time monitoring</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search disasters, locations, or types..."
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setShowSuggestions(true); }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              className="w-full h-10 pl-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-300 focus:bg-white/15 focus:border-red-400/50 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
            />
            {searchText && (
              <button
                onClick={() => { setSearchText(""); setShowSuggestions(false); }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                {suggestions.map(event => (
                  <div
                    key={event.id}
                    className="px-4 py-3 cursor-pointer hover:bg-red-50/80 transition-colors border-b border-slate-100/50 last:border-b-0 group"
                    onClick={() => {
                      setSearchText(event.name);
                      handleSearch();
                      onSelectEvent?.(event);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{event.name}</p>
                        <p className="text-xs text-slate-500">{event.disasterTypeName} • {event.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={filters.disasterType} onValueChange={val => handleChange("disasterType", val)}>
            <SelectTrigger className="w-44 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300 [&>svg]:text-white" style={{ height: "40px" }}>
              <SelectValue placeholder="🌪️ Disaster Type" className="text-white" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20">
              {[...new Set(events.map(e => e.disasterTypeName))].map(type => (
                <SelectItem key={type} value={type} className="hover:bg-red-50">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={val => handleChange("status", val)}>
            <SelectTrigger className="w-36 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300 [&>svg]:text-white" style={{ height: "40px" }}>
              <SelectValue placeholder="📊 Status" className="text-white" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20">
              <SelectItem value="Active" className="hover:bg-green-50"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div>Active</div></SelectItem>
              <SelectItem value="Closed" className="hover:bg-gray-50"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full"></div>Closed</div></SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/15 hover:text-white transition-all duration-300">
                {date ? format(date, "MMM dd, yyyy") : "📅 Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-white/95 backdrop-blur-md border border-white/20">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={handleClear}
            className="h-12 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300 relative"
          >
            <Filter className="mr-2 h-4 w-4" /> Clear
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {activeFiltersCount}
            </span>
          </Button>
        )}
      </div>

      {/* Active Filters Indicator */}
      {activeFiltersCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>
      )}
    </header>
  );
};

export default MapNavbar;
