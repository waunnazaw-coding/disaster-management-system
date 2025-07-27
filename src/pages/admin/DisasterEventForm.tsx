"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import FileUploader from "@/components/FileUploader";
import api from "@/api/axioInstance";
import { getAllDisasterTypes, DisasterType } from "@/api/disasterTypeApi";

interface EventFormCreateDto {
  LocationName: string;
  GeoJson: string;
  Name: string;
  DisasterTypeId: number;
  StartDate: string;
  Severity?: string;
  Description?: string;
  Files?: File[];
}

interface DisasterEventFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function DisasterEventForm({ onCancel, onSuccess }: DisasterEventFormProps) {
  const [step, setStep] = useState(1);
  const [disasterTypes, setDisasterTypes] = useState<DisasterType[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<EventFormCreateDto>({
    LocationName: "",
    GeoJson: "",
    Name: "",
    DisasterTypeId: 0,
    StartDate: "",
    Severity: "",
    Description: "",
    Files: [],
  });

  // Fetch disaster types on step 1
  useEffect(() => {
    if (step === 1) {
      getAllDisasterTypes()
        .then(setDisasterTypes)
        .catch(() => toast.error("Failed to load disaster types"));
    }
  }, [step]);

  // Handlers
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  async function submitOccurrence() {
    try {
      const form = new FormData();
      form.append("LocationName", formData.LocationName);
      form.append("GeoJson", formData.GeoJson);
      form.append("Name", formData.Name);
      form.append("DisasterTypeId", formData.DisasterTypeId.toString());
      form.append("StartDate", formData.StartDate);
      form.append("Severity", formData.Severity || "");
      form.append("Description", formData.Description || "");
      files.forEach((file) => form.append("Files", file));

      const response = await api.post("/DisasterEvent/submit-form", form);
      const result = response.data;
      if (result.isSuccess) {
        toast.success("Disaster Event created successfully");
        onSuccess();
      } else {
        toast.error(result.message || "Failed to create event");
      }
    } catch (error) {
      toast.error("Error submitting event form");
      console.error(error);
    }
  }

  const parsedGeojson = useMemo(() => {
    if (!formData.GeoJson) return undefined;
    try {
      return JSON.parse(formData.GeoJson);
    } catch {
      return undefined;
    }
  }, [formData.GeoJson]);

  const handleChangeGeojson = useCallback((geojson: any) => {
    setFormData((prev) => ({
      ...prev,
      GeoJson: JSON.stringify(geojson),
    }));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Disaster Event Wizard</h1>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Step 1: Event Info</h2>
          <div>
            <Label htmlFor="Name">Event Name</Label>
            <Input
              name="Name"
              value={formData.Name}
              onChange={onChange}
              placeholder="Event Name"
            />
          </div>
          <h3 className="font-semibold mt-4">Select Disaster Type</h3>
          {disasterTypes.map((type) => (
            <Card
              key={type.id}
              onClick={() => setFormData((prev) => ({ ...prev, DisasterTypeId: type.id }))}
              className={`cursor-pointer ${
                formData.DisasterTypeId === type.id ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <CardContent>
                <h3 className="font-bold">{type.name}</h3>
                <p className="text-sm">{type.category}</p>
                <p className="text-xs">{type.description}</p>
              </CardContent>
            </Card>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
             <Button onClick={nextStep} disabled={!formData.Name || !formData.DisasterTypeId}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Step 2: Event Details</h2>
          <div>
            <Label htmlFor="StartDate">Start Date</Label>
            <Input type="date" name="StartDate" value={formData.StartDate} onChange={onChange} />
          </div>
          <div>
            <Label htmlFor="Severity">Severity</Label>
            <Input name="Severity" value={formData.Severity || ""} onChange={onChange} />
          </div>
          <div>
            <Label htmlFor="Description">Description</Label>
            <Textarea name="Description" value={formData.Description || ""} onChange={onChange} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Step 3: Location & Files</h2>
          <div>
            <Label htmlFor="LocationName">Location Name</Label>
            <Input name="LocationName" value={formData.LocationName} onChange={onChange} />
          </div>
          <DisasterMap geojsonData={parsedGeojson} onChangeGeojson={handleChangeGeojson} />
          <FileUploader onChange={setFiles} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={submitOccurrence}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
}
