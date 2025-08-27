"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, X, ArrowLeft, Megaphone } from 'lucide-react';
import DisasterEventSelect, { DisasterEvent } from "@/components/disaster/DisasterEventSelect";
import { getAllActiveDisasterEvents } from "@/api/disasterEventApi";
import api from "@/api/axioInstance";
import SuccessModal from "@/components/Modals/SuccessModal";

interface ImpactObject {
    objectName: string;
    value: string;
    errors?: { objectName?: string; value?: string };
}

interface ImpactFormDto {
    DisasterEventId: number | null;
    Type: string;
    Objects: ImpactObject[];
    Status?: string;
}

interface ImpactFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

const IMPACT_TYPE_OPTIONS = [
    { value: "Infrastructure Damage", label: "Infrastructure Damage - Damage to buildings, roads, bridges" },
    { value: "Casualties", label: "Casualties - Number of people injured or dead" },
    { value: "Economic Loss", label: "Economic Loss - Financial cost of the disaster" },
    { value: "Environmental Impact", label: "Environmental Impact - Effects on nature, wildlife, pollution" },
    { value: "Displacement", label: "Displacement - Number of people forced to relocate" },
    { value: "Power Outage", label: "Power Outage - Loss of electricity supply" },
    { value: "Communication Breakdown", label: "Communication Breakdown - Disruption of phone, internet networks" },
    { value: "Water Supply Contamination", label: "Water Supply Contamination - Unsafe drinking water conditions" },
    { value: "Crop Damage", label: "Crop Damage - Agricultural losses" },
];

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function ImpactFormForUsers({ onCancel, onSuccess }: ImpactFormProps) {
    const [impactData, setImpactData] = useState<ImpactFormDto>({
        DisasterEventId: null,
        Type: "",
        Objects: [{ objectName: "", value: "" }],
        Status: "Pending"
    });

    const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<DisasterEvent[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasSelectedEvent, setHasSelectedEvent] = useState(false);
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const ignoreNextSearch = useRef(false);
    const searchAbortController = useRef<AbortController | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Optionally preload disasterEvents or leave empty
    useEffect(() => {
        async function fetchDisasterEvents() {
            try {
                const data = await getAllActiveDisasterEvents();
                setDisasterEvents(data);
            } catch (error) {
                toast.error("Failed to load disaster events");
                console.error(error);
            }
        }

        fetchDisasterEvents();
    }, []);

    useEffect(() => {
        if (ignoreNextSearch.current) {
            ignoreNextSearch.current = false;
            return;
        }

        // Cancel previous search request
        if (searchAbortController.current) {
            searchAbortController.current.abort();
        }

        if (debouncedSearchTerm.trim().length > 2) {
            setSearchLoading(true);
            
            // Create new abort controller for this request
            searchAbortController.current = new AbortController();
            
            api.get(`/DisasterEvent/search?name=${encodeURIComponent(debouncedSearchTerm.trim())}`, {
                signal: searchAbortController.current.signal
            })
            .then((res) => {
                if (res.data && Array.isArray(res.data)) {
                    setSearchResults(res.data);
                } else {
                    setSearchResults([]);
                }
            })
            .catch((error) => {
                // Don't show error if request was aborted
                if (error.name !== 'AbortError') {
                    console.error('Search error:', error);
                    toast.error("Failed to search disaster events");
                    setSearchResults([]);
                }
            })
            .finally(() => {
                setSearchLoading(false);
            });
        } else {
            setSearchResults([]);
            setSearchLoading(false);
        }

        // Cleanup function
        return () => {
            if (searchAbortController.current) {
                searchAbortController.current.abort();
            }
        };
    }, [debouncedSearchTerm]);

    const onImpactChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setImpactData((prev) => ({ ...prev, [name]: value }));
    };

    const onObjectChange = (index: number, field: keyof Omit<ImpactObject, "errors">, value: string) => {
        const newObjects = [...impactData.Objects];
        newObjects[index][field] = value;

        if (newObjects[index].errors) {
            newObjects[index].errors = {
                ...newObjects[index].errors,
                [field]: "",
            };
        }

        setImpactData((prev) => ({ ...prev, Objects: newObjects }));
    };

    const addObjectRow = () => {
        setImpactData((prev) => ({
            ...prev,
            Objects: [...prev.Objects, { objectName: "", value: "" }],
        }));
    };

    const removeObjectRow = (index: number) => {
        const newObjects = impactData.Objects.filter((_, i) => i !== index);
        setImpactData((prev) => ({ ...prev, Objects: newObjects }));
    };

    const onSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        
        // Only reset selection if we're actually changing the search term
        if (!hasSelectedEvent || newSearchTerm !== searchTerm) {
            setImpactData((prev) => ({ ...prev, DisasterEventId: null }));
            setHasSelectedEvent(false);
        }
    };

    const selectDisasterEvent = (id: number, name: string) => {
        setImpactData((prev) => ({ ...prev, DisasterEventId: id }));
        ignoreNextSearch.current = true;
        setSearchTerm(name);
        setSearchResults([]);
        setHasSelectedEvent(true);
        setSearchActive(false);
    };

    const clearSearch = () => {
        setSearchActive(false);
        setSearchTerm("");
        setSearchResults([]);
        setHasSelectedEvent(false);
        if (searchAbortController.current) {
            searchAbortController.current.abort();
        }
    };

    async function submitImpact() {
        if (reporting) return; // Prevent extra clicks
        setReporting(true);
        setHasTriedSubmit(true);

        // Validation
        if (!impactData.DisasterEventId) {
            toast.error("Please select a Disaster Event");
            setReporting(false);
            return;
        }
        if (!impactData.Type) {
            toast.error("Please select an Impact Type");
            setReporting(false);
            return;
        }

        const updatedObjects = [...impactData.Objects];
        let hasError = false;
        updatedObjects.forEach((obj) => {
            obj.errors = {};
            if (!obj.objectName || obj.objectName.trim() === "") {
                obj.errors.objectName = "Can't leave this input";
                hasError = true;
            }
            if (!obj.value || obj.value.trim() === "") {
                obj.errors.value = "Can't leave this input";
                hasError = true;
            }
        });
        setImpactData((prev) => ({ ...prev, Objects: updatedObjects }));
        
        if (hasError) {
            setReporting(false);
            return;
        }

        try {
            const payload = impactData.Objects.map((obj) => ({
                DisasterEventId: impactData.DisasterEventId,
                Type: impactData.Type,
                Value: obj.value.trim(),
                ObjectName: obj.objectName.trim(),
                Status: impactData.Status || "Pending",
            }));

            const response = await api.post("/Impact/submit-multiple", payload);
            if (response.data.isSuccess) {
                toast.success("Impact reported successfully");
                setShowSuccessModal(true);
            } else {
                toast.error(response.data.message || "Failed to report impact");
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error("Error submitting impact form");
        } finally {
            setReporting(false);
        }
    }

    const getValueLabel = () => {
        switch (impactData.Type) {
            case "Casualties":
                return "How many people?";
            case "Infrastructure Damage":
                return "Number";
            case "Economic Loss":
                return "Amount";
            case "Environmental Impact":
                return "Effected Area";
            case "Displacement":
                return "Number People";
            case "Power Outage":
                return "Effected Area";
            case "Communication Breakdown":
                return "Effected Area";
            case "Water Supply Contamination":
                return "Contaminated Area";
            case "Crop Damage":
                return "Affected Crop total and Area";
            default:
                return "Value";
        }
    };

    const getObjectLabel = () => {
        switch (impactData.Type) {
            case "Casualties":
                return "Injured or Dead";
            case "Infrastructure Damage":
                return "Object Type and Name";
            case "Economic Loss":
                return "Currency ($/K/etc.,)";
            case "Environmental Impact":
                return "Effected Type/Name";
            case "Displacement":
                return "Replaced Location Name";
            case "Power Outage":
                return "Situation";
            case "Communication Breakdown":
                return "Situation Description and Started Date";
            case "Water Supply Contamination":
                return "Contaminated Water Source";
            case "Crop Damage":
                return "Crop Type and Description";
            default:
                return "Object Name";
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 shadow rounded">
            <h1 className="text-2xl font-bold mb-4 text-blue-500">Related Impact report Survey</h1>

            {!searchActive && (
                <div className="mb-4">
                    <Label className="text-sm text-gray-500">
                        Select Disaster Event
                    </Label>
                    <div className="flex justify-between">
                        <DisasterEventSelect
                            disasterEvents={disasterEvents}
                            value={impactData.DisasterEventId}
                            onChange={(val) => setImpactData((prev) => ({ ...prev, DisasterEventId: val }))}
                        />
                        <Button
                            variant="outline"
                            className="ml-0.5 hover:text-white hover:bg-blue-600 h-11"
                            onClick={() => setSearchActive(true)}
                        >
                            <Search />
                        </Button>
                    </div>
                </div>
            )}

            {searchActive && (
                <div className="mb-4 relative">
                    <Label htmlFor="search" className="text-sm text-gray-600 font-medium mb-2 block">
                        Search Disaster Event
                    </Label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <div className="relative">
                                <Input
                                    id="search"
                                    placeholder="Type to search disaster events..."
                                    value={searchTerm}
                                    onChange={onSearchTermChange}
                                    autoComplete="off"
                                    className="h-12 pl-10 pr-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>

                            {searchLoading && (
                                <div className="absolute top-full left-0 w-full mt-1 z-20">
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                            <p className="text-sm text-gray-500">Searching events...</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {searchResults.length > 0 && !searchLoading && (
                                <ul className="absolute bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-48 overflow-auto w-full mt-1 z-20">
                                    <li className="px-3 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Available Events
                                    </li>
                                    {searchResults.map((event, index) => (
                                        <li
                                            key={event.id}
                                            className={`px-4 py-3 cursor-pointer transition-all duration-150 border-b border-gray-100 last:border-b-0 ${
                                                impactData.DisasterEventId === event.id 
                                                    ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-500" 
                                                    : "hover:bg-blue-50 hover:text-blue-600 text-gray-700"
                                            } ${index === searchResults.length - 1 ? 'rounded-b-lg' : ''}`}
                                            onClick={() => selectDisasterEvent(event.id, event.name ?? "")}
                                        >
                                            <div className="font-medium">{event.name}</div>
                                            {event.description && (
                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                    {event.description}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                            {!searchLoading && 
                             searchResults.length === 0 && 
                             debouncedSearchTerm.trim().length > 2 && 
                             !hasSelectedEvent && (
                                <div className="absolute top-full left-0 w-full">
                                    <p className="text-sm text-gray-500 mt-1">No results found</p>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            className="h-12 px-4 text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 rounded-lg border-2"
                            onClick={clearSearch}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <Label htmlFor="Type" className="text-sm text-gray-500">
                        Impact Type
                    </Label>
                    <select
                        id="Type"
                        name="Type"
                        value={impactData.Type}
                        onChange={onImpactChange}
                        className="block w-full rounded border border-gray-300 p-2"
                    >
                        <option value="">Select an impact type...</option>
                        {IMPACT_TYPE_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3">
                    <Label className="text-sm text-gray-500">Impact Objects / People</Label>
                    {impactData.Objects.map((obj, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input
                                        placeholder={getObjectLabel()}
                                        value={obj.objectName}
                                        onChange={(e) => onObjectChange(index, "objectName", e.target.value)}
                                    />
                                    {hasTriedSubmit && obj.errors?.objectName && (
                                        <p className="text-red-500 text-sm mt-1">{obj.errors.objectName}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        placeholder={getValueLabel()}
                                        value={obj.value}
                                        onChange={(e) => onObjectChange(index, "value", e.target.value)}
                                    />
                                    {hasTriedSubmit && obj.errors?.value && (
                                        <p className="text-red-500 text-sm mt-1">{obj.errors.value}</p>
                                    )}
                                </div>
                                {impactData.Objects.length > 1 && (
                                    <Button variant="destructive" onClick={() => removeObjectRow(index)}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addObjectRow} className="hover:bg-blue-500 hover:text-white">
                        + Add Row
                    </Button>
                </div>

                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={onCancel}>
                        <ArrowLeft className="mr-1" />
                        Back
                    </Button>
                    <Button
                        onClick={submitImpact}
                        disabled={reporting || !impactData.Type || !impactData.DisasterEventId}
                    >
                        {reporting ? "Reporting..." : (
                            <>
                                <Megaphone className="mr-1" />
                                Report
                            </>
                        )}
                    </Button>

                    <SuccessModal
                        open={showSuccessModal}
                        title="Impact has been reported Successfully!"
                        message="Thank you for your valuable report. We sincerely appreciate your effort and will use this information effectively. Your continued contributions are always welcome. You can report more impacts if needed."
                        onClose={() => {
                            setShowSuccessModal(false);
                            onSuccess(); // keep your existing flow
                        }}
                    />
                </div>
            </div>
        </div>
    );
}