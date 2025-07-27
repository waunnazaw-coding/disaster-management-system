"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/api/axioInstance";

interface DisasterEventShort {
    id: number;
    name: string;
}

interface ImpactObject {
    objectName: string;
    value: string;
    errors?: { objectName?: string; value?: string };
}

interface ImpactFormDto {
    DisasterEventId: number | null;
    Type: string;
    Objects: ImpactObject[];
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

export default function ImpactForm({ onCancel, onSuccess }: ImpactFormProps) {
    const [impactData, setImpactData] = useState<ImpactFormDto>({
        DisasterEventId: null,
        Type: "",
        Objects: [{ objectName: "", value: "" }],
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<DisasterEventShort[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasSelectedEvent, setHasSelectedEvent] = useState(false);
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
    const ignoreNextSearch = useRef(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (ignoreNextSearch.current) {
            ignoreNextSearch.current = false;
            return;
        }
        if (debouncedSearchTerm.length > 2) {
            setSearchLoading(true);
            api
                .get(`/DisasterEvent/search?name=${encodeURIComponent(debouncedSearchTerm)}`)
                .then((res) => setSearchResults(res.data))
                .catch(() => toast.error("Failed to search disaster events"))
                .finally(() => setSearchLoading(false));
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm]);

    const onImpactChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setImpactData((prev) => ({ ...prev, [name]: value }));
    };

    const onObjectChange = (
        index: number,
        field: keyof Omit<ImpactObject, "errors">,
        value: string
    ) => {
        const newObjects = [...impactData.Objects];
        newObjects[index][field] = value;

        // Clear validation error for this field
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
        setSearchTerm(e.target.value);
        setImpactData((prev) => ({ ...prev, DisasterEventId: null }));
        setHasSelectedEvent(false);
    };

    const selectDisasterEvent = (id: number, name: string) => {
        setImpactData((prev) => ({ ...prev, DisasterEventId: id }));
        ignoreNextSearch.current = true;
        setSearchTerm(name);
        setSearchResults([]);
        setHasSelectedEvent(true);
    };

    async function submitImpact() {
        setHasTriedSubmit(true);

        if (!impactData.DisasterEventId) {
            toast.error("Please select a Disaster Event");
            return;
        }
        if (!impactData.Type) {
            toast.error("Please select an Impact Type");
            return;
        }

        // Validate rows
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
        if (hasError) return;

        try {
            const payload = impactData.Objects.map(obj => ({
                DisasterEventId: impactData.DisasterEventId,
                Type: impactData.Type,
                Value: obj.value,
                ObjectName: obj.objectName,
            }));

            const response = await api.post("/Impact/submit-multiple", payload);
            if (response.data.isSuccess) {
                toast.success("Impact reported successfully");
                onSuccess();
            } else {
                toast.error(response.data.message || "Failed to report impact");
            }
        } catch (error) {
            toast.error("Error submitting impact form");
            console.error(error);
        }
    }

    // Dynamic Labels based on Type
    const getValueLabel = () => {
        switch (impactData.Type) {
            case "Casualties":
                return "How many people?";
            case "Infrastructure Damage":
                return "Amount";
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
            default:
                return "Object Name";
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Report Disaster Impact</h1>
            <div className="mb-4 relative">
                <Label htmlFor="search">Search Disaster Event</Label>
                <Input
                    id="search"
                    placeholder="Search by event name..."
                    value={searchTerm}
                    onChange={onSearchTermChange}
                    autoComplete="off"
                />
                {searchLoading && <p className="text-sm text-gray-400 mt-1">Loading...</p>}
                {searchResults.length > 0 && (
                    <ul className="absolute bg-white border rounded shadow-md max-h-40 overflow-auto w-full mt-1 z-10">
                        {searchResults.map((event) => (
                            <li
                                key={event.id}
                                className={`p-2 cursor-pointer hover:bg-blue-100 ${impactData.DisasterEventId === event.id ? "bg-blue-200" : ""
                                    }`}
                                onClick={() => selectDisasterEvent(event.id, event.name)}
                            >
                                {event.name}
                            </li>
                        ))}
                    </ul>
                )}
                {!hasSelectedEvent && searchResults.length === 0 && !searchLoading && searchTerm.length > 2 && (
                    <p className="text-sm text-gray-500 mt-1">No results found</p>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="Type">Impact Type</Label>
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
                    <Label>Impact Objects / People</Label>
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
                    <Button variant="outline" onClick={addObjectRow}>
                        + Add Row
                    </Button>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={onCancel}>
                        Back
                    </Button>
                    <Button onClick={submitImpact} disabled={!impactData.Type || !impactData.DisasterEventId}>
                        Submit Impact
                    </Button>
                </div>
            </div>
        </div>
    );
}
