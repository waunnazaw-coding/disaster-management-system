"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import api from "@/api/axioInstance";
import { toast } from "sonner";
import { getAllDisasterTypes } from "@/api/disasterTypeApi";
import "@/styles/new.css";
import SuccessModal from "@/components/Modals/SuccessModal";

interface DisasterType {
    id: number;
    name: string;
}

interface ExistingImpact {
    id: number;
    type: string;
    value?: string;
    objectName?: string;
    originalType: string;
    originalValue?: string;
    originalObjectName?: string;
}

interface ExistingPhoto {
    id: number;
    filePath: string;
    description: string;
    originalDescription: string;
    updatedFile?: File;
}

interface EventFormUpdateDto {
    id: number;
    name: string;
    disasterTypeId: number;
    startDate: string | null;
    status: string;
    severity: string;
    source?: string;
    description: string;
    locationName?: string;
    geoJson?: string;
    existingPhotos?: ExistingPhoto[];
    deletedPhotoIds?: number[];
    newPhotos?: File[];
    newPhotoDescription?: string[];
    existingImpacts?: ExistingImpact[];
    deletedImpactIds?: number[];
}

interface Props {
    eventId: number;
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

export default function DisasterEventUpdateForm({ eventId, onCancel, onSuccess }: Props) {
    const [formData, setFormData] = useState<EventFormUpdateDto | null>(null);
    const [disasterTypes, setDisasterTypes] = useState<DisasterType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // Update impact handler
    const updateImpact = (index: number, field: keyof ExistingImpact, value: string) => {
        setFormData(prev => {
            if (!prev) return prev;
            const updated = [...(prev.existingImpacts ?? [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, existingImpacts: updated };
        });
    };



    // Remove impact handler
    const removeImpact = (id: number) => {
        setFormData(prev => {
            if (!prev) return prev;
            const filtered = (prev.existingImpacts ?? []).filter(i => i.id !== id);
            return {
                ...prev,
                existingImpacts: filtered,
                deletedImpactIds: [...(prev.deletedImpactIds ?? []), id],
            };
        });
    };

    // Preview URLs for updated existing photos
    useEffect(() => {
        if (!formData?.existingPhotos) {
            setPreviewUrls([]);
            return;
        }

        const urls = formData.existingPhotos.map(photo =>
            photo.updatedFile ? URL.createObjectURL(photo.updatedFile) : null
        );
        setPreviewUrls(urls);

        return () => {
            urls.forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [formData?.existingPhotos]);

    // Fetch event data and disaster types
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const res = await api.get(`/DisasterEvent/update/${eventId}`);
                const event = res.data?.data;
                console.log("Fetched event data:", event);

                if (res.data?.isSuccess && event) {
                    const photosWithOriginalDesc = (event.existingPhotos || []).map((p: ExistingPhoto) => ({
                        ...p,
                        originalDescription: p.description || "",
                    }));
                    const impactsWithOriginal = (event.existingImpacts || []).map((imp: ExistingImpact) => ({
                        ...imp,
                        originalType: imp.type,
                        originalValue: imp.value,
                        originalObjectName: imp.objectName,
                    }));

                    setFormData({
                        ...event,
                        existingPhotos: photosWithOriginalDesc,
                        existingImpacts: impactsWithOriginal,
                        deletedImpactIds: [],
                    });
                } else {
                    setError("Failed to load event data.");
                }
            } catch {
                setError("An error occurred while loading event data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();

        getAllDisasterTypes()
            .then(setDisasterTypes)
            .catch(() => toast.error("Failed to load disaster types"));
    }, [eventId]);

    // Generic form field updater
    const updateForm = (field: keyof EventFormUpdateDto, value: string | number) => {
        setFormData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: field === "disasterTypeId" && typeof value === "string" ? parseInt(value) : value,
            };
        });
    };

    // Remove existing photo handler
    const removeExistingPhoto = (id: number) => {
        if (!formData) return;
        setFormData({
            ...formData,
            existingPhotos: formData.existingPhotos?.filter(p => p.id !== id) || [],
            deletedPhotoIds: [...(formData.deletedPhotoIds || []), id],
        });
    };

    // Submit handler with form data packaging
    const handleSubmit = async () => {
        if (!formData) return;
        setSubmitting(true);

        const form = new FormData();

        // Append all other form fields.
        Object.entries(formData).forEach(([key, value]) => {
            if (
                value != null &&
                key !== "existingPhotos" &&
                key !== "geoJson" &&
                key !== "deletedPhotoIds" &&
                key !== "newPhotos" &&
                key !== "newPhotoDescription" &&
                key !== "existingImpacts" &&
                key !== "deletedImpactIds"
            ) {
                form.append(key, value.toString());
            }
        });

        if (formData.geoJson) form.append("GeoJson", formData.geoJson);

        if (formData.deletedPhotoIds && formData.deletedPhotoIds.length > 0) {
            formData.deletedPhotoIds.forEach(id => form.append("DeletedPhotoIds", id.toString()));
        }

        if (formData.existingPhotos && formData.existingPhotos.length > 0) {
            formData.existingPhotos.forEach((photo, index) => {
                form.append(`ExistingPhotos[${index}].Id`, photo.id.toString());
                form.append(`ExistingPhotos[${index}].Description`, photo.description || "");
                if ((photo as any).updatedFile) {
                    form.append(`ExistingPhotos[${index}].File`, (photo as any).updatedFile);
                } else {
                    form.append(`ExistingPhotos[${index}].FilePath`, photo.filePath);
                }
            });
        }

        if (formData.newPhotos && formData.newPhotos.length > 0) {
            formData.newPhotos.forEach((file, index) => {
                if (file) {
                    form.append("NewPhotos", file, file.name);
                    form.append("NewPhotoDescription", formData.newPhotoDescription?.[index] ?? "");
                }
            });
        }



        // Append existing impacts
        if (formData.existingImpacts && formData.existingImpacts.length > 0) {
            formData.existingImpacts.forEach((imp, index) => {
                form.append(`ExistingImpacts[${index}].Id`, imp.id.toString());
                form.append(`ExistingImpacts[${index}].Type`, imp.type);
                form.append(`ExistingImpacts[${index}].Value`, imp.value ?? "");
                form.append(`ExistingImpacts[${index}].ObjectName`, imp.objectName ?? "");
            });
        }

        // Append deleted impact IDs
        if (formData.deletedImpactIds && formData.deletedImpactIds.length > 0) {
            formData.deletedImpactIds.forEach(id => form.append("DeletedImpactIds", id.toString()));
        }

        try {
            const res = await api.put(`/DisasterEvent/update/${formData.id}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data && (res.data.isSuccess === undefined || res.data.isSuccess === true)) {
                toast.success("Disaster event updated!");
                setShowSuccess(true);
            } else {
                toast.error(res.data.message || "Update failed");
            }
        } catch (err) {
            toast.error("An error occurred while updating.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const parsedGeoJson = useMemo(() => {
        if (!formData?.geoJson) return null;
        try {
            return JSON.parse(formData.geoJson);
        } catch (err) {
            console.error("Invalid GeoJSON:", err);
            return null;
        }
    }, [formData?.geoJson]);

    const handleModalClose = () => {
        setShowSuccess(false);
        onSuccess();  // notify parent to reset mode to "none"
    };

    if (loading) return <p>Loading event...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!formData) return <p>Event not found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-2xl mt-5">
            <h2 className="text-2xl font-bold text-blue-500 mb-5">Update Disaster Event</h2>

            {/* Name */}
            <div>
                <Label className="text-gray-500 text-sm">Disaster Event's Name</Label>
                <Input className="mb-3" value={formData.name} onChange={e => updateForm("name", e.target.value)} />
            </div>

            {/* Disaster Type */}
            <div>
                <Label className="text-gray-500 text-sm">Disaster Type</Label>
                <select
                    className="block w-full rounded border px-2 py-2 mb-3"
                    value={formData.disasterTypeId.toString()}
                    onChange={e => updateForm("disasterTypeId", e.target.value)}
                >
                    <option value="">Select Disaster Type</option>
                    {disasterTypes.map(type => (
                        <option key={type.id} value={type.id.toString()}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div>
                <Label className="text-gray-500 text-sm">Disaster event description</Label>
                <Textarea
                    className="mb-3"
                    value={formData.description}
                    onChange={e => updateForm("description", e.target.value)}
                />
            </div>

            {/* Severity */}
            <div>
                <Label className="text-gray-500 text-sm">Severity</Label>
                <Select
                    value={["Critical", "High", "Medium", "Low"].includes(formData.severity) ? formData.severity : ""}
                    onValueChange={value => updateForm("severity", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>

            </div>

            {/* Status */}
            <div className="mt-3 mb-3">
                <Label className="text-gray-500 text-sm">Status</Label>
                <Select
                    value={formData.status || ""}
                    onValueChange={value => updateForm("status", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Closed">Case closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Source */}
            <div>
                <Label className="text-gray-500 text-sm">Source from</Label>
                <Input
                    className="mb-3"
                    value={formData.source || ""}
                    onChange={e => updateForm("source", e.target.value)}
                />
            </div>

            {/* Location Name */}
            <div>
                <Label className="text-gray-500 text-sm">Location Name</Label>
                <Input
                    className="mb-3"
                    value={formData.locationName || ""}
                    onChange={e => updateForm("locationName", e.target.value)}
                />
            </div>

            {/* Disaster Map */}
            <DisasterMap
                geojsonData={parsedGeoJson}
                onChangeGeojson={geojson =>
                    setFormData(prev => (prev ? { ...prev, geoJson: JSON.stringify(geojson) } : prev))
                }
                viewOnly={false}
            />

            {/* Existing Photos */}
            <div>
                <Label className="mt-5">Existing Photos</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                    {(formData?.existingPhotos?.length ?? 0) === 0 ? (
                        <p>No existing photos.</p>
                    ) : (
                        formData.existingPhotos!.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative group p-2 border rounded-md w-full shadow-sm flex flex-col gap-2"
                            >
                                <img
                                    src={
                                        (photo as any).updatedFile
                                            ? previewUrls[index] || undefined
                                            : photo.filePath
                                    }
                                    alt="Existing"
                                    className="h-full w-full object-cover rounded"
                                />

                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/gif"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setFormData(prev => {
                                                if (!prev) return prev;
                                                const updatedPhotos = [...(prev.existingPhotos ?? [])];
                                                updatedPhotos[index] = {
                                                    ...updatedPhotos[index],
                                                    updatedFile: file,
                                                };
                                                return { ...prev, existingPhotos: updatedPhotos };
                                            });
                                        }
                                    }}
                                    className="text-sm"
                                />

                                <Textarea
                                    value={photo.description}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData(prev => {
                                            if (!prev) return prev;
                                            const updatedPhotos = [...(prev.existingPhotos ?? [])];
                                            updatedPhotos[index] = {
                                                ...updatedPhotos[index],
                                                description: val,
                                            };
                                            return { ...prev, existingPhotos: updatedPhotos };
                                        });
                                    }}
                                    placeholder="Photo description"
                                    className="text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => {
                                            if (!prev) return prev;
                                            const filteredPhotos = (prev.existingPhotos ?? []).filter(
                                                p => p.id !== photo.id
                                            );
                                            const updatedDeletedIds = [...(prev.deletedPhotoIds ?? []), photo.id];
                                            return {
                                                ...prev,
                                                existingPhotos: filteredPhotos,
                                                deletedPhotoIds: updatedDeletedIds,
                                            };
                                        });
                                    }}
                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    aria-label="Remove photo"
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Upload New Photos */}
            <div className="mt-6">
                <Label className="mb-2 block">Upload New Photos</Label>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        setFormData(prev => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                newPhotos: [...(prev.newPhotos ?? []), null as any],
                                newPhotoDescription: [...(prev.newPhotoDescription ?? []), ""],
                            };
                        })
                    }
                >
                    + Add Photo
                </Button>

                <div className="flex flex-wrap gap-4 mt-4">
                    {(formData?.newPhotos ?? []).map((file, index) => {
                        const previewUrl = file ? URL.createObjectURL(file) : null;

                        return (
                            <div
                                key={index}
                                className="relative w-full p-3 border rounded-md shadow-sm flex flex-col gap-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => {
                                            if (!prev) return prev;
                                            const updatedFiles = [...(prev.newPhotos ?? [])];
                                            const updatedDescriptions = [...(prev.newPhotoDescription ?? [])];
                                            updatedFiles.splice(index, 1);
                                            updatedDescriptions.splice(index, 1);
                                            return {
                                                ...prev,
                                                newPhotos: updatedFiles,
                                                newPhotoDescription: updatedDescriptions,
                                            };
                                        });
                                    }}
                                    className="absolute top-1 right-1 text-red-600 font-bold text-xl leading-none bg-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100"
                                    aria-label={`Remove photo ${index + 1}`}
                                >
                                    ×
                                </button>

                                {!file ? (
                                    <label
                                        style={{
                                            width: "100%",
                                            height: "112px",
                                            border: "2px dashed #ccc",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "2rem",
                                            cursor: "pointer",
                                        }}
                                    >
                                        +
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/gif"
                                            style={{ display: "none" }}
                                            onChange={e => {
                                                const newFile = e.target.files?.[0];
                                                if (!newFile) return;

                                                setFormData(prev => {
                                                    if (!prev) return prev;
                                                    const updated = [...(prev.newPhotos ?? [])];
                                                    updated[index] = newFile;
                                                    return { ...prev, newPhotos: updated };
                                                });
                                            }}
                                        />
                                    </label>
                                ) : (
                                    <img
                                        src={previewUrl as string}
                                        alt={`New Upload ${index + 1}`}
                                        className="h-full w-full object-cover rounded"
                                    />
                                )}

                                <Textarea
                                    placeholder={`Description for photo ${index + 1}`}
                                    value={formData.newPhotoDescription?.[index] ?? ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData(prev => {
                                            if (!prev) return prev;
                                            const updatedDescriptions = [...(prev.newPhotoDescription ?? [])];
                                            updatedDescriptions[index] = val;
                                            return { ...prev, newPhotoDescription: updatedDescriptions };
                                        });
                                    }}
                                    className="text-sm"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Existing Impacts Section */}
                <div className="mt-3">
                    <label className="mb-2 block font-bold text-xl">Related Impacts</label>
                    <div className="flex flex-col gap-4 mt-2">
                        {(formData?.existingImpacts?.length ?? 0) === 0 ? (
                            <p>No existing impacts.</p>
                        ) : (
                            formData.existingImpacts!.map((impact, index) => (
                                <div
                                    key={impact.id}
                                    className="relative p-3 border rounded-md shadow-sm flex gap-2"
                                >
                                    {/* Impact Type Select */}
                                    <div>
                                        <label htmlFor={`impact-type-${impact.id}`} className="block mb-1 font-medium">
                                            Type
                                        </label>
                                        <select
                                            id={`impact-type-${impact.id}`}
                                            value={impact.type}
                                            onChange={e => updateImpact(index, "type", e.target.value)}
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

                                    {/* Impact Value Input */}
                                    <div>
                                        <label className="block mb-1 font-medium">Value</label>
                                        <input
                                            type="text"
                                            value={impact.value || ""}
                                            onChange={e => updateImpact(index, "value", e.target.value)}
                                            className="mb-1 block w-full rounded border border-gray-300 p-2"
                                        />
                                    </div>

                                    {/* Impact Object Name Input */}
                                    <div>
                                        <label className="block mb-1 font-medium">Object Name</label>
                                        <input
                                            type="text"
                                            value={impact.objectName || ""}
                                            onChange={e => updateImpact(index, "objectName", e.target.value)}
                                            className="mb-1 block w-full rounded border border-gray-300 p-2"
                                        />
                                    </div>

                                    {/* Remove Impact Button */}
                                    <button
                                        type="button"
                                        onClick={() => removeImpact(impact.id)}
                                        className="absolute top-1 right-1 text-red-600 font-bold text-xl leading-none bg-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100"
                                        aria-label="Remove impact"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Form buttons */}
            <div className="flex justify-between mt-5">
                <Button onClick={onCancel} className="bg-red-500" disabled={submitting}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                    <Save />
                    {submitting ? "Saving..." : "Save"}
                </Button>
            </div>

            <SuccessModal
                open={showSuccess}
                title="Report updated!"
                message=""
                onClose={handleModalClose}
            />
        </div>
    );
}
