"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getAllDisasterTypes, DisasterType } from "@/api/disasterTypeApi";
import { getAllActiveDisasterEvents } from "@/api/disasterEventApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import api from "@/api/axioInstance";
import { Megaphone, ArrowLeft, ArrowRight, FilePlus } from "lucide-react";
import SuccessModal from "@/components/Modals/SuccessModal";

interface DisasterEvent {
  id: number;
  name: string;
  severity?: string;
  locationName?: string;
  description?: string;
}

interface FormCreateDto {
  LocationName: string;
  GeoJson: string;
  DisasterEventId?: number;
  AddressDetail?: string;
  Type: string;
  Title?: string;
  Description?: string;
  Severity: string;
  Source?: string;
  ReportPhotos: File[];
  NewPhotoDescription: string[];
}

interface ImpactFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// Custom hook for generating preview URLs from File[] with cleanup
function usePreviewUrls(files: File[]) {
  const [urls, setUrls] = useState<(string | null)[]>([]);

  useEffect(() => {
    const newUrls = files.map((file) => (file.name ? URL.createObjectURL(file) : null));
    setUrls(newUrls);

    return () => {
      newUrls.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [files]);

  return urls;
}

export default function DisasterReportForm({ onCancel, onSuccess }: ImpactFormProps) {
  const [step, setStep] = useState(1);
  const [disasterTypes, setDisasterTypes] = useState<DisasterType[]>([]);
  const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [formData, setFormData] = useState<Omit<FormCreateDto, "UserId">>({
    LocationName: "",
    GeoJson: "",
    Type: "",
    ReportPhotos: [],
    NewPhotoDescription: [],
    Severity: "",
  });

  // Generate preview URLs for photos
  const previewUrls = usePreviewUrls(formData.ReportPhotos);

  // Validation for Step 2 required fields
  const isStep2Valid = useMemo(() => {
    return (
      formData.AddressDetail?.trim() &&
      formData.Title?.trim() &&
      formData.Description?.trim() &&
      formData.Severity?.trim() &&
      formData.Source?.trim()
    );
  }, [formData]);

  // Mapping backend disaster type names to frontend keys for background images
  const disasterTypeKeyMap: Record<string, string> = {
    Terrorism: "TerroristAttack",
    "Volcanic Eruption": "Volcano",
    "Cyber Attack": "CyberAttack",
    "Chemical Spill": "ChemicalSpill",
    "Nuclear Accident": "NuclearAccident",
    "Industrial Accident": "IndustrialAccident",
  };

  const backgroundMap: Record<string, string> = {
    Earthquake: "/images/earthquake.jpg",
    Flood: "/images/flood.jpg",
    Wildfire: "/images/wildfire.jpg",
    Hurricane: "/images/hurricane.jpg",
    Tornado: "/images/tornado.jpg",
    Landslide: "/images/landslide.jpg",
    ChemicalSpill: "/images/chemicalspill.jpg",
    CyberAttack: "/images/cyber-attack.jpg",
    Pandemic: "/images/pandemic.jpg",
    Drought: "/images/drought.jpg",
    IndustrialAccident: "/images/industrialAccident.jpg",
    TerroristAttack: "/images/terroristAttack.jpg",
    NuclearAccident: "/images/nuclear-accident.jpg",
    Volcano: "/images/volcano.jpg",
  };

  const normalizedType =
    disasterTypeKeyMap[formData.Type] || formData.Type.replace(/\s+/g, "");
  const backgroundImage = backgroundMap[normalizedType];

  // Fetch disaster types on step 1
  useEffect(() => {
    if (step === 1) {
      setLoadingTypes(true);
      getAllDisasterTypes()
        .then(setDisasterTypes)
        .catch(() => toast.error("Failed to load disaster types"))
        .finally(() => setLoadingTypes(false));
    }
  }, [step]);

  // Fetch active disaster events on step 2
  useEffect(() => {
    if (step === 2) {
      getAllActiveDisasterEvents()
        .then(setDisasterEvents)
        .catch(() => toast.error("Failed to load disaster events"));
    }
  }, [step]);

  // Generic input change handler for text inputs and textareas
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Navigation between steps
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Add a blank photo slot for user to upload
  const addPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      ReportPhotos: [...prev.ReportPhotos, new File([], "")],
      NewPhotoDescription: [...prev.NewPhotoDescription, ""],
    }));
  };

  // Remove photo & description by index
  const removePhoto = (index: number) => {
    setFormData((prev) => {
      const newPhotos = [...prev.ReportPhotos];
      const newDescriptions = [...prev.NewPhotoDescription];
      newPhotos.splice(index, 1);
      newDescriptions.splice(index, 1);
      return {
        ...prev,
        ReportPhotos: newPhotos,
        NewPhotoDescription: newDescriptions,
      };
    });
  };

  // Update photo file at given index
  const updatePhoto = (index: number, file: File) => {
    setFormData((prev) => {
      const newPhotos = [...prev.ReportPhotos];
      newPhotos[index] = file;
      return { ...prev, ReportPhotos: newPhotos };
    });
  };

  // Update description string at given index
  const updateDescription = (index: number, desc: string) => {
    setFormData((prev) => {
      const newDescriptions = [...prev.NewPhotoDescription];
      newDescriptions[index] = desc;
      return { ...prev, NewPhotoDescription: newDescriptions };
    });
  };

  // Submit form to backend
  const submitForm = async () => {
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("LocationName", formData.LocationName);
      form.append("GeoJson", formData.GeoJson);
      if (formData.DisasterEventId !== undefined) {
        form.append("DisasterEventId", formData.DisasterEventId.toString());
      }
      form.append("AddressDetail", formData.AddressDetail || "");
      form.append("Type", formData.Type);
      form.append("Title", formData.Title || "");
      form.append("Description", formData.Description || "");
      form.append("Severity", formData.Severity || "");
      form.append("Source", formData.Source || "");

      formData.ReportPhotos.forEach((file) => {
        if (file.name) form.append("ReportPhotos", file);
      });

      formData.NewPhotoDescription.forEach((desc, i) => {
        form.append(`NewPhotoDescription[${i}]`, desc);
      });

      const response = await api.post("/DisasterReport/submit-form", form);

      if (response.data?.isSuccess) {
        toast.success("Report submitted successfully");
        setShowSuccess(true);
      } else {
        toast.error(response.data?.message || "Submission failed");
      }
    } catch (error) {
      toast.error("Error submitting form");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Parse GeoJSON string to object for map component
  const parsedGeojson = useMemo(() => {
    try {
      return formData.GeoJson ? JSON.parse(formData.GeoJson) : undefined;
    } catch {
      return undefined;
    }
  }, [formData.GeoJson]);

  // Update GeoJSON on map change
  const handleChangeGeojson = useCallback((geojson: any) => {
    setFormData((prev) => ({
      ...prev,
      GeoJson: JSON.stringify(geojson),
    }));
  }, []);

  const handleModalClose = () => {
    setShowSuccess(false);
    onSuccess();  // notify parent to reset mode to "none"
  };

  return (
    <div className="max-w-3xl mx-auto p-3 mt-5">
      <h1 className="text-2xl font-bold mb-4 text-blue-500">Disaster Report Survey</h1>

      {/* STEP 1: Select Disaster Type */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto p-6 shadow rounded">
          <h2 className="font-semibold text-lg mb-4">Step 1: Select Disaster Type</h2>

          <div className="p-4 rounded-md space-y-2">
            {loadingTypes ? (
              // Skeleton loading cards
              [1, 2, 3].map((i) => (
                <Card key={i} className="border border-gray-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="animate-pulse space-y-2">
                      <div className="h-6 w-32 bg-gray-300 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              disasterTypes.map((type) => {
                const key =
                  disasterTypeKeyMap[type.name] || type.name.replace(/\s+/g, "");
                const bgImage = backgroundMap[key];

                return (
                  <Card
                    key={type.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, Type: type.name }))
                    }
                    className={`cursor-pointer mt-2 border ${formData.Type === type.name
                        ? "border-blue-500 border-3"
                        : "border-gray-300"
                      }`}
                    style={
                      bgImage
                        ? {
                          backgroundImage: `url(${bgImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          color: "white",
                        }
                        : {}
                    }
                  >
                    <CardContent className="bg-black/60 p-4 rounded">
                      <div className="flex justify-between">
                        <h2 className="text-xl font-bold">{type.name}</h2>
                        <p className="text-sm italic">{type.category}</p>
                      </div>
                      <p className="text-sm mt-1">{type.description}</p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <div className="flex gap-2 mt-5 justify-between">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-1" />
              Back
            </Button>
            <Button onClick={nextStep} disabled={!formData.Type || loadingTypes}>
              Next
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Disaster Report Details */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto p-6 shadow rounded">
          <h2 className="font-semibold text-lg">Step 2: Disaster Report</h2>

          <div className="mt-5">
            <Label className="text-sm text-gray-500">Select related disaster event (optional)</Label>
            <select
              name="DisasterEventId"
              value={formData.DisasterEventId ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  DisasterEventId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="border rounded p-2 w-full"
            >
              <option value="">None</option>
              {disasterEvents.map((ev) => {
                const name = ev.name || "Unnamed";
                const location = ev.locationName || "N/A";
                const severity = ev.severity || "N/A";
                const description = ev.description ?? "N/A";
                const shortDescription =
                  description.length > 10 ? `${description.slice(0, 10)}...` : description;

                return (
                  <option key={ev.id} value={ev.id}>
                    {`Name: ${name}, Location: ${location}, Severity: ${severity}, Description: ${shortDescription}`}
                  </option>
                );
              })}
            </select>
          </div>

          <Label className="text-sm text-gray-500 mt-5">
            Please provide the address detail of the disaster event.
            <span className="redstar">*</span>
          </Label>
          <Textarea
            name="AddressDetail"
            value={formData.AddressDetail || ""}
            onChange={onChange}
            placeholder="Address"
            className="w-full"
          />

          <Label className="text-sm text-gray-500 mt-5">
            Please provide a title for the disaster event.
            <span className="redstar">*</span>
          </Label>
          <Input
            name="Title"
            value={formData.Title || ""}
            onChange={onChange}
            placeholder="Title"
          />

          <Label className="text-sm text-gray-500 mt-5">
            Please provide a detailed description of the disaster event.
            <span className="redstar">*</span>
          </Label>
          <Textarea
            name="Description"
            value={formData.Description || ""}
            onChange={onChange}
            placeholder="Description"
          />

          <Label className="text-sm text-gray-500 mt-5">
            Please provide the severity of the disaster event.
            <span className="redstar">*</span>
          </Label>
          <Select
            value={formData.Severity || ""}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, Severity: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Label className="text-sm text-gray-500 mt-5">
            Please provide the source of the report.
            <span className="redstar">*</span>
          </Label>
          <Input
            name="Source"
            value={formData.Source || ""}
            onChange={onChange}
            placeholder="Anonymous or Name"
          />

          <div className="flex gap-2 mt-5 justify-between">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="mr-1" />
              Back
            </Button>
            <Button onClick={nextStep} disabled={!isStep2Valid}>
              Next
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Location and Photos */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto p-6 shadow rounded">
          <h2 className="font-semibold text-lg mb-5">Step 3: Location & Photos</h2>

          <Label className="block text-sm text-gray-500">
            Give a brief, identifiable name for this location
            <span className="redstar">*</span>
          </Label>
          <Input
            className="mb-5"
            name="LocationName"
            value={formData.LocationName}
            onChange={onChange}
            placeholder="Eg., Yangon, Insein..."
          />

          <DisasterMap geojsonData={parsedGeojson} onChangeGeojson={handleChangeGeojson} />

          <div className="mt-6">
            <Label className="mb-2 block text-sm text-gray-500">
              Attach Photos of the Affected Area
              <span className="redstar">*</span>
            </Label>
            <Button variant="outline" onClick={addPhoto} className="hover:bg-blue-500 hover:text-white">
              <FilePlus className="mr-1" /> Add Photo
            </Button>

            <div className="flex flex-wrap gap-4 mt-4">
              {formData.ReportPhotos.map((file, index) => {
                const previewUrl = previewUrls[index];

                return (
                  <div
                    key={index}
                    className="relative w-48 p-3 border rounded-md shadow-sm flex flex-col gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 text-red-600 font-bold text-xl leading-none bg-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100"
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      ×
                    </button>

                    {!file.name ? (
                      <label className="flex items-center justify-center h-28 w-full border-2 border-dashed text-2xl cursor-pointer">
                        +
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            e.target.files && updatePhoto(index, e.target.files[0])
                          }
                        />
                      </label>
                    ) : (
                      <img
                        src={previewUrl || undefined}
                        alt={`Upload ${index + 1}`}
                        className="h-28 w-full object-cover rounded"
                        loading="eager"
                      />
                    )}

                    <Textarea
                      placeholder={`Description for photo ${index + 1}`}
                      value={formData.NewPhotoDescription[index]}
                      onChange={(e) => updateDescription(index, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 mt-5 justify-between">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="mr-1" />
              Back
            </Button>
            <Button onClick={submitForm} disabled={submitting || !formData.Type}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Submitting...
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <Megaphone className="mr-1" />
                  Report
                </div>
              )}
            </Button>
          </div>
        </div>
      )}

      <SuccessModal
        open={showSuccess}
        title="Report Submitted!"
        message="Thank you for your valuable report. We sincerely appreciate your effort and will use this information effectively. Your continued contributions are always welcome."
        onClose={handleModalClose}
      />

    </div>

  );
}
