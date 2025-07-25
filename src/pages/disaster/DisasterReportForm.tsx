"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getAllDisasterTypes, DisasterType } from "@/api/disasterTypeApi";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import api from "@/api/axioInstance";
import FileUploader from "@/components/FileUploader";

// Types
interface DisasterEvent {
  id: number;
  name: string;
}

interface FormCreateDto {
  LocationName: string;
  GeoJson: string;
  DisasterEventId?: number;
  AddressDetail?: string;
  Type: string;
  Title?: string;
  Description?: string;
  Severity?: string;
  Source?: string;
  Files?: File[];
}


export default function DisasterReportWizard() {
  const [step, setStep] = useState(1);
  const [disasterTypes, setDisasterTypes] = useState<DisasterType[]>([]);
  const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);
  const [files, setFiles] = useState<File[]>([]); // store selected files

  // This is your form data state but without UserId initially (set it dynamically)
  const [formData, setFormData] = useState<Omit<FormCreateDto, "UserId">>({
    LocationName: "",
    GeoJson: "",
    Type: "",
  });

  // Fetch Disaster Types on Step 1
  useEffect(() => {
    if (step === 1) {
      getAllDisasterTypes()
        .then((data) => setDisasterTypes(data))
        .catch(() => toast.error("Failed to load disaster types"));
    }
  }, [step]);

  // Fetch Disaster Events on Step 2
  useEffect(() => {
    if (step === 2) {
      fetch("/api/disaster-events")
        .then((res) => res.json())
        .then((data) => setDisasterEvents(data))
        .catch(() => toast.error("Failed to load disaster events"));
    }
  }, [step]);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function nextStep() {
    if (step < 3) setStep(step + 1);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  async function submitForm() {
    try {
      const form = new FormData();

      form.append("LocationName", formData.LocationName);
      form.append("GeoJson", formData.GeoJson);
      if (formData.DisasterEventId !== undefined && formData.DisasterEventId !== null) {
        form.append("DisasterEventId", formData.DisasterEventId.toString());
      }
      form.append("AddressDetail", formData.AddressDetail || "");
      form.append("Type", formData.Type);
      form.append("Title", formData.Title || "");
      form.append("Description", formData.Description || "");
      form.append("Severity", formData.Severity || "");
      form.append("Source", formData.Source || "");

      files.forEach((file) => {
        form.append("Files", file); // Must match FormCreateDto's property name
      });

      const response = await api.post("/DisasterReport/submit-form", form);

      const result = response.data;
      if (result.isSuccess) {
        toast.success("Report submitted successfully");
      } else {
        toast.error(result.message || "Submission failed");
      }
    } catch (error) {
      toast.error("Error submitting form");
      console.error(error);
    }
  }

  // Memoize parsed GeoJSON to avoid recreating object every render
  const parsedGeojson = useMemo(() => {
    if (!formData.GeoJson) return undefined;
    try {
      return JSON.parse(formData.GeoJson);
    } catch {
      return undefined;
    }
  }, [formData.GeoJson]);

  // Memoize onChangeGeojson to avoid infinite update loops
  const handleChangeGeojson = useCallback(
    (geojson: any) => {
      setFormData((prev) => ({
        ...prev,
        GeoJson: JSON.stringify(geojson),
      }));
    },
    [setFormData]
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Disaster Report Wizard</h1>

      {/* STEP 1: Disaster Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Step 1: Select Disaster Type</h2>
          {disasterTypes.map((type) => (
            <Card
              key={type.id}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  Type: type.name,
                }))
              }
              className={`cursor-pointer ${
                formData.Type === type.name ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <CardContent>
                <h3 className="font-bold">{type.name}</h3>
                <p className="text-sm">{type.category}</p>
                <p className="text-xs">{type.description}</p>
              </CardContent>
            </Card>
          ))}

          <Button onClick={nextStep} disabled={!formData.Type}>
            Next
          </Button>
        </div>
      )}

      {/* STEP 2: Disaster Report */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Step 2: Disaster Report</h2>

          <div>
            <Label htmlFor="DisasterEventId">Related Event</Label>
            <select
              name="DisasterEventId"
              value={formData.DisasterEventId ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  DisasterEventId: Number(e.target.value) || undefined,
                }))
              }
              className="border rounded p-2 w-full"
            >
              <option value="">None</option>
              {disasterEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="AddressDetail">Address</Label>
            <Input name="AddressDetail" value={formData.AddressDetail || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="Title">Title</Label>
            <Input name="Title" value={formData.Title || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="Description">Description</Label>
            <Textarea name="Description" value={formData.Description || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="Severity">Severity</Label>
            <Input name="Severity" value={formData.Severity || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="Source">Source</Label>
            <Input
              name="Source"
              placeholder="Anonymous or Name"
              value={formData.Source || ""}
              onChange={onChange}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {/* STEP 3: Location and Photos */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Step 3: Location & Photos</h2>

          <div>
            <Label htmlFor="LocationName">Location Name</Label>
            <Input name="LocationName" value={formData.LocationName} onChange={onChange} />
          </div>

          {/* DisasterMap Integration */}
          <div>
            <DisasterMap geojsonData={parsedGeojson} onChangeGeojson={handleChangeGeojson} />
          </div>

          {/* File Upload */}
          <FileUploader onChange={(files) => setFiles(files)} />

          <div className="flex gap-2">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={submitForm}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
}
