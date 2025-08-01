"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import api from "@/api/axioInstance";
import { toast } from "sonner";
import { getAllDisasterTypes } from "@/api/disasterTypeApi";
import PhotoUploader from "@/components/PhotoUploader";

interface DisasterType {
    id: number;
    name: string;
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
    severity: string;
    description: string;
    locationName?: string;
    geoJson?: string;
    existingPhotos?: ExistingPhoto[];
    deletedPhotoIds?: number[];
    newPhotos?: File[];
    newPhotoDescription?: string[];
}

interface Props {
    eventId: number;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function DisasterEventUpdateForm({ eventId, onCancel, onSuccess }: Props) {
    const [formData, setFormData] = useState<EventFormUpdateDto | null>(null);
    const [disasterTypes, setDisasterTypes] = useState<DisasterType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([]);

    // For preview URLs of updated existing photos, watch formData.existingPhotos
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


    // Fetch event data and set formData (including photos) on load
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const res = await api.get(`/DisasterEvent/update/${eventId}`);
                const event = res.data?.data;

                if (res.data?.isSuccess && event) {
                    // Add originalDescription to existingPhotos if needed
                    const photosWithOriginalDesc = (event.existingPhotos || []).map((p: ExistingPhoto) => ({
                        ...p,
                        originalDescription: p.description || "",
                    }));

                    // Set entire formData, but replace existingPhotos with updated one with originalDesc
                    setFormData({
                        ...event,
                        existingPhotos: photosWithOriginalDesc,
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


    const updateForm = (field: keyof EventFormUpdateDto, value: string | number) => {
        setFormData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]:
                    field === "disasterTypeId" && typeof value === "string" ? parseInt(value) : value,
            };
        });
    };

    const removeExistingPhoto = (id: number) => {
        if (!formData) return;
        setFormData({
            ...formData,
            existingPhotos: formData.existingPhotos?.filter(p => p.id !== id) || [],
            deletedPhotoIds: [...(formData.deletedPhotoIds || []), id],
        });
    };


    const handleSubmit = async () => {
        if (!formData) return;
        setSubmitting(true);

        const form = new FormData();

        // Append all formData fields except these special ones
        Object.entries(formData).forEach(([key, value]) => {
            if (
                value != null &&
                key !== "existingPhotos" &&
                key !== "geoJson" &&
                key !== "deletedPhotoIds" &&
                key !== "newPhotos" &&
                key !== "newPhotoDescription"
            ) {
                form.append(key, value.toString());
            }
        });

        console.log("Form data before appending photos:", formData);

        // Append geoJson if present
        if (formData.geoJson) {
            form.append("GeoJson", formData.geoJson);
        }

        // Append DeletedPhotoIds (if any)
        if (formData.deletedPhotoIds && formData.deletedPhotoIds.length > 0) {
            formData.deletedPhotoIds.forEach(id => form.append("DeletedPhotoIds", id.toString()));
        }

        // Append existing photos with their fields
        if (formData.existingPhotos && formData.existingPhotos.length > 0) {
            formData.existingPhotos.forEach((photo, index) => {
                form.append(`ExistingPhotos[${index}].Id`, photo.id.toString());
                form.append(`ExistingPhotos[${index}].Description`, photo.description || "");

                if ((photo as any).updatedFile) { // cast to any to access updatedFile if present
                    form.append(`ExistingPhotos[${index}].File`, (photo as any).updatedFile);
                } else {
                    form.append(`ExistingPhotos[${index}].FilePath`, photo.filePath);
                }
            });
        }

        // Append new photos and descriptions
        if (formData.newPhotos && formData.newPhotos.length > 0) {
            formData.newPhotos.forEach((file, index) => {
                form.append("NewPhotos", file);
            });
        }
        if (formData.newPhotoDescription && formData.newPhotoDescription.length > 0) {
            formData.newPhotoDescription.forEach((desc, index) => {
                form.append("NewPhotoDescription", desc ?? "");
            });
        }

        // Debug print all form entries before sending
        for (const [key, value] of form.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const res = await api.put(`/DisasterEvent/update/${formData.id}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data && (res.data.isSuccess === undefined || res.data.isSuccess === true)) {
                toast.success("Disaster event updated!");
                onSuccess();
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

    if (loading) return <p>Loading event...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!formData) return <p>Event not found.</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Update Disaster Event</h2>

            <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => updateForm("name", e.target.value)} />
            </div>

            <div>
                <Label>Disaster Type</Label>
                <select
                    className="block w-full rounded border px-2 py-1"
                    value={formData.disasterTypeId.toString()}
                    onChange={(e) => updateForm("disasterTypeId", e.target.value)}
                >
                    <option value="">Select Disaster Type</option>
                    {disasterTypes.map((type) => (
                        <option key={type.id} value={type.id.toString()}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <Label>Description</Label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                />
            </div>

            <div>
                <Label>Location Name</Label>
                <Input
                    value={formData.locationName || ""}
                    onChange={(e) => updateForm("locationName", e.target.value)}
                />
            </div>

            <DisasterMap
                geojsonData={parsedGeoJson}
                onChangeGeojson={(geojson) =>
                    setFormData((prev) => (prev ? { ...prev, geoJson: JSON.stringify(geojson) } : prev))
                }
                viewOnly={false}
            />

            <div>
                <Label>Existing Photos</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                    {(formData?.existingPhotos?.length ?? 0) === 0 ? (
                        <p>No existing photos.</p>
                    ) : (
                        formData.existingPhotos!.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative group p-2 border rounded-md w-48 shadow-sm flex flex-col gap-2"
                            >
                                <img
                                    src={
                                        (photo as any).updatedFile
                                            ? previewUrls[index] || undefined
                                            : photo.filePath
                                    }
                                    alt="Existing"
                                    className="h-28 w-full object-cover rounded"
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setFormData((prev) => {
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
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData((prev) => {
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
                                        setFormData((prev) => {
                                            if (!prev) return prev;
                                            // Remove photo from existingPhotos
                                            const filteredPhotos = (prev.existingPhotos ?? []).filter(
                                                (p) => p.id !== photo.id
                                            );
                                            // Add removed photo ID to deletedPhotoIds array
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

            <div className="mt-6">
                <Label>Upload New Photos</Label>
                <PhotoUploader
                    onPhotosChange={(files) => {
                        setFormData((prev) => {
                            if (!prev) return prev;

                            const prevDescriptions = prev.newPhotoDescription ?? [];

                            const newDescriptions = files.map((_, index) => prevDescriptions[index] ?? "");

                            return {
                                ...prev,
                                newPhotos: files,
                                newPhotoDescription: newDescriptions,
                            };
                        });
                    }}
                />


                {(formData?.newPhotos ?? []).map((_, index) => (
                    <Textarea
                        key={index}
                        className="mt-2"
                        placeholder={`Description for photo ${index + 1}`}
                        value={formData.newPhotoDescription?.[index] ?? ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => {
                                if (!prev) return prev;
                                const newDescs = [...(prev.newPhotoDescription ?? [])];
                                newDescs[index] = val;
                                return { ...prev, newPhotoDescription: newDescs };
                            });
                        }}
                    />
                ))}
            </div>


            <div className="flex gap-2 mt-4">
                <Button onClick={onCancel} variant="secondary" disabled={submitting}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </div>
    );
}
