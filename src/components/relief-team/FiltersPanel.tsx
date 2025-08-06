"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce"; // Adjust relative import if needed
import { Button } from "@/components/ui/button";

interface FiltersPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  specializationFilter: string;
  onSpecializationChange: (value: string) => void;
  teamSizeFilter: string;
  onTeamSizeChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  locationFilter,
  onLocationChange,
  specializationFilter,
  onSpecializationChange,
  teamSizeFilter,
  onTeamSizeChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const myanmarLocations = [
    "all",
    "Ayeyarwady",
    "Bago",
    "Chin State",
    "Kachin State",
    "Kayah State",
    "Kayin State",
    "Magway",
    "Mandalay",
    "Mon State",
    "Naypyidaw",
    "Rakhine State",
    "Sagaing",
    "Shan State",
    "Tanintharyi",
    "Yangon",
    // Major cities/townships (optional)
    "Mawlamyine",
    "Taunggyi",
    "Pathein",
    "Myitkyina",
    "Sittwe",
    "Lashio",
    "Magway",
    "Pyay",
  ];

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search and Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
        {/* Search box */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            aria-label="Search relief teams"
            placeholder="Search teams..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10"
            autoComplete="off"
          />
        </div>

        {/* Status Filter */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger
              aria-label="Filter by status"
              className="w-full md:w-[180px]"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Deployed">Deployed</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <Select value={locationFilter} onValueChange={onLocationChange}>
            <SelectTrigger
              aria-label="Filter by location"
              className="w-full md:w-[200px]"
            >
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              {myanmarLocations.map((loc) => (
                <SelectItem key={loc} value={loc.toLowerCase()}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialization Filter */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <Select
            value={specializationFilter}
            onValueChange={onSpecializationChange}
          >
            <SelectTrigger
              aria-label="Filter by specialization"
              className="w-full md:w-[200px]"
            >
              <SelectValue placeholder="Filter by specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="Natural Disasters">Natural Disasters</SelectItem>
              <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
              <SelectItem value="Search & Rescue">Search & Rescue</SelectItem>
              <SelectItem value="Fire Emergency">Fire Emergency</SelectItem>
              <SelectItem value="Water Rescue">Water Rescue</SelectItem>
              <SelectItem value="Chemical Hazards">Chemical Hazards</SelectItem>
              <SelectItem value="Urban Rescue">Urban Rescue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Team Size Filter */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <Select value={teamSizeFilter} onValueChange={onTeamSizeChange}>
            <SelectTrigger
              aria-label="Filter by team size"
              className="w-full md:w-[180px]"
            >
              <SelectValue placeholder="Filter by team size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small (1-5)</SelectItem>
              <SelectItem value="medium">Medium (6-15)</SelectItem>
              <SelectItem value="large">Large (16+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="text-right">
          <Button
            variant="outline"
            onClick={onClearFilters}
            size="sm"
            className="rounded-md px-5 py-2 text-sm font-semibold hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
