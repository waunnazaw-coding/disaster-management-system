// Modified and Full Disaster Event Form Component
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, ArrowLeft, ArrowRight, Save, FilePlus } from "lucide-react"
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import api from "@/api/axioInstance";
import { getAllDisasterTypes, DisasterType } from "@/api/disasterTypeApi";
import "@/styles/new.css";
import SuccessModal from "@/components/Modals/SuccessModal";

export interface EventFormCreateDto {
  LocationName: string;
  GeoJson: string;
  Name: string;
  DisasterTypeId: number;
  StartDate: string;
  LocationId: number;
  Severity?: string;
  Description?: string;
  NewPhotoDescription: string[];
  ReportPhotos: File[];
  Source: string;
}

interface DisasterEventFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function DisasterEventForm({ onCancel, onSuccess }: DisasterEventFormProps) {
  const [step, setStep] = useState(1);
  const [disasterTypes, setDisasterTypes] = useState<DisasterType[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<EventFormCreateDto>({
    LocationName: "",
    GeoJson: "",
    Name: "",
    DisasterTypeId: 0,
    StartDate: "",
    LocationId: 0,
    Severity: "",
    Description: "",
    NewPhotoDescription: [],
    ReportPhotos: [],
    Source: "",
  });

  const disasterTypeImages: Record<number, string> = {
    1: "/images/earthquake.jpg",
    2: "/images/flood.jpg",
    3: "/images/hurricane.jpg",
    4: "/images/tornado.jpg",
    5: "/images/wildfire.jpg",
    6: "/images/landslide.jpg",
    7: "/images/volcano.jpg",
    8: "/images/drought.jpg",
    9: "/images/pandemic.jpg",
    10: "/images/chemicalspill.jpg",
    11: "/images/nuclear-accident.jpg",
    12: "/images/cyber-attack.jpg",
    13: "/images/terroristAttack.jpg",
    14: "/images/industrialAccident.jpg",
  };

  useEffect(() => {
    getAllDisasterTypes()
      .then(setDisasterTypes)
      .catch(() => toast.error("Failed to load disaster types"));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => step < 3 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const parsedGeojson = useMemo(() => {
    try {
      return formData.GeoJson ? JSON.parse(formData.GeoJson) : undefined;
    } catch {
      return undefined;
    }
  }, [formData.GeoJson]);

  const handleChangeGeojson = useCallback((geojson: any) => {
    setFormData((prev) => ({ ...prev, GeoJson: JSON.stringify(geojson) }));
  }, []);

  // Validation for step 2
  const isStep2Valid =
    formData.StartDate &&
    formData.Severity &&
    formData.Description &&
    formData.Source;

  // Validation for step 3 (photos required)
  const isStep3Valid =
    formData.LocationName &&
    parsedGeojson &&
    formData.ReportPhotos.length > 0 &&
    formData.ReportPhotos.every((file) => file.name) && // ensure all have files
    formData.NewPhotoDescription.every((desc) => desc.trim() !== "");


  const addPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      ReportPhotos: [...prev.ReportPhotos, new File([], "")],
      NewPhotoDescription: [...prev.NewPhotoDescription, ""]
    }));
  };

  const updatePhoto = (index: number, file: File) => {
    setFormData((prev) => {
      const photos = [...prev.ReportPhotos];
      photos[index] = file;
      return { ...prev, ReportPhotos: photos };
    });
  };

  const updateDescription = (index: number, desc: string) => {
    setFormData((prev) => {
      const descriptions = [...prev.NewPhotoDescription];
      descriptions[index] = desc;
      return { ...prev, NewPhotoDescription: descriptions };
    });
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => {
      const photos = [...prev.ReportPhotos];
      const descriptions = [...prev.NewPhotoDescription];
      photos.splice(index, 1);
      descriptions.splice(index, 1);
      return { ...prev, ReportPhotos: photos, NewPhotoDescription: descriptions };
    });
  };

  const submitOccurrence = async () => {
    try {
      const form = new FormData();
      setLoading(true);
      form.append("LocationName", formData.LocationName);
      form.append("GeoJson", formData.GeoJson);
      form.append("Name", formData.Name);
      form.append("DisasterTypeId", formData.DisasterTypeId.toString());
      form.append("StartDate", formData.StartDate);
      form.append("Severity", formData.Severity || "");
      form.append("Description", formData.Description || "");
      form.append("Source", formData.Source || "");

      formData.ReportPhotos.forEach((file, idx) => {
        form.append("ReportPhotos", file);
        form.append(`NewPhotoDescription[${idx}]`, formData.NewPhotoDescription[idx] || "");
      });

      const response = await api.post("/DisasterEvent/submit-form", form);
      if (response.data.isSuccess) {
        toast.success("Disaster Event created successfully");
        setShowSuccess(true);
      } else {
        toast.error(response.data.message || "Failed to create event");
      }
    } catch (error) {
      toast.error("Error submitting event form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    onSuccess();  // notify parent to reset mode to "none"
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-xl border-2 rounded">
      <h1 className="text-2xl font-bold mb-4">Disaster Event Survey</h1>

      {step === 1 && (
        <>
          <Label className="text-sm text-gray-500">Event Name<span className="redstar">*</span></Label>
          <Input name="Name" value={formData.Name} onChange={onChange} placeholder="Event Name" />

          <Label className="text-sm text-gray-500 mt-4">Select Disaster Type<span className="redstar">*</span></Label>
          {disasterTypes.map((type) => {
            const isSelected = formData.DisasterTypeId === type.id;
            const bgImage = disasterTypeImages[type.id];
            return (
              <Card
                key={type.id}
                onClick={() => setFormData((prev) => ({ ...prev, DisasterTypeId: type.id }))}
                className={`cursor-pointer mt-2 border ${isSelected ? "border-blue-500 border-2" : "border-gray-300"}`}
                style={bgImage ? {
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white"
                } : {}}
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
          })}
          <div className="flex gap-2 mt-4 justify-between">
            <Button className="bg-red-500" onClick={onCancel}>Cancel</Button>
            <Button onClick={nextStep} disabled={!formData.Name || !formData.DisasterTypeId}>Next <ArrowRight /></Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Label className="text-sm text-gray-500 mb-1 block" htmlFor="StartDate">
            Please provide the start date of disaster occurrence <span className="redstar">*</span>
          </Label>

          {/* Calendar Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.StartDate && "text-muted-foreground"
                )}
              >
                {formData.StartDate ? format(new Date(formData.StartDate), "PPP") : "Pick a date"}
                <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.StartDate ? new Date(formData.StartDate) : undefined}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    const formatted = format(selectedDate, "yyyy-MM-dd");
                    setFormData((prev) => ({ ...prev, StartDate: formatted }));
                  }
                }}
                captionLayout="dropdown"
                className="rounded-md border shadow-sm"
              />
            </PopoverContent>
          </Popover>


          <Label className="text-sm text-gray-500 mt-3" htmlFor="Severity">Please provide the severity of the disaster event.<span className="redstar">*</span></Label>
          <Select
            value={formData.Severity || ""}
            onValueChange={(value) => setFormData({ ...formData, Severity: value })}
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

          <Label className="text-sm text-gray-500 mt-3" htmlFor="Description">Please provide a detailed description of the disaster event.<span className="redstar">*</span></Label>
          <Textarea name="Description" value={formData.Description || ""} onChange={onChange} />

          <Label className="text-sm text-gray-500 mt-3" htmlFor="Source">Please provide the source of the disaster event information.<span className="redstar">*</span></Label>
          <Input name="Source" value={formData.Source} onChange={onChange} placeholder="Eg., Gdacs ,User, Repoter Organization " />

          <div className="flex gap-2 mt-4 justify-between">
            <Button variant="outline" onClick={prevStep}><ArrowLeft />Back</Button>
            <Button onClick={nextStep} disabled={!isStep2Valid}>
              Next<ArrowRight />
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Label className="block text-sm text-gray-500" htmlFor="LocationName">Give a brief, identifiable name for this location<span className="redstar">*</span></Label>
          <Input className="mb-3" name="LocationName" value={formData.LocationName} onChange={onChange} placeholder="Eg., Yangon, Insein..." />

          <DisasterMap geojsonData={parsedGeojson} onChangeGeojson={handleChangeGeojson} />

          <div className="mt-6">
            <Label className="mb-2 block text-sm text-gray-500">
              Attach Photos of the Affected Area
              <span className="redstar">*</span>
            </Label>
            <Button variant="outline" onClick={addPhoto}><FilePlus /> Add Photo</Button>
            <div className="flex flex-wrap gap-4 mt-4">
              {formData.ReportPhotos.map((file, index) => (
                <div key={index} className="relative w-48 p-3 border rounded shadow-sm">
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 text-red-500 bg-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-200"
                  >×</button>
                  {!file.name ? (
                    <label className="flex items-center justify-center h-28 border-dashed border-2 cursor-pointer">
                      +
                      <input type="file" accept="image/*" hidden onChange={(e) => e.target.files && updatePhoto(index, e.target.files[0])} />
                    </label>
                  ) : (
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-28 w-full object-cover rounded" />
                  )}
                  <Textarea
                    placeholder={`Description for photo ${index + 1}`}
                    value={formData.NewPhotoDescription[index]}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    className="text-sm mt-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-5 justify-between">
            <Button variant="outline" onClick={prevStep}><ArrowLeft />Back</Button>
            <Button onClick={submitOccurrence} disabled={!isStep3Valid || loading}>
              <Save className="mr-1" />
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </>
      )}

      <SuccessModal
        open={showSuccess}
        title="Event Created!"
        message=""
        onClose={handleModalClose}
      />
    </div>
  );
}
