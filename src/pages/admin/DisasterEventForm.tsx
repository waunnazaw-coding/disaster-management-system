"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, ArrowLeft, ArrowRight, Save, FilePlus, Shield, MapPin, Eye } from "lucide-react"
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
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
import { getAllDisasterReports, DisasterReport, approveDisapproveReport, markReportChecked, unrejectReport } from "@/api/disasterReportApi";
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
  const navigate = useNavigate();
  const [pendingReports, setPendingReports] = useState<DisasterReport[]>([]);
  // Outside of your map, at the top of the component
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-400 text-green-800";
      case "Rejected": return "bg-red-500 text-red-800";
      case "Fake": return "bg-gray-400 text-white";
      default: return "bg-yellow-300 text-gray-800";
    }
  };

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

  const severityOrder: Record<string, number> = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  const sortedPendingReports = [...pendingReports].sort((a, b) => {
    const severityDiff = (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5);
    if (severityDiff !== 0) return severityDiff;
    // If same severity, show newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  useEffect(() => {
    getAllDisasterTypes()
      .then(setDisasterTypes)
      .catch(() => toast.error("Failed to load disaster types"));
  }, []);

  // fetch pending disaster reports
  useEffect(() => {
    getAllDisasterReports()
      .then((data) => {
        const severityOrder: Record<string, number> = {
          Critical: 0,
          High: 1,
          Medium: 2,
          Low: 3,
        };
        const pending = data
          .filter((r) => r.status === "Pending")
          .sort((a, b) => {
            const aDate = new Date(a.createdAt).getTime();
            const bDate = new Date(b.createdAt).getTime();
            if (bDate !== aDate) return bDate - aDate; // newest first
            return (
              (severityOrder[a.severity] ?? 99) -
              (severityOrder[b.severity] ?? 99)
            );
          });
        setPendingReports(pending);
      })
      .catch(() => toast.error("Failed to load disaster reports"));
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
    <div className="flex gap-6">
      {/* Left*/}
      <div className="flex-1 h-full max-w-7xl mx-auto p-6 shadow-xl border-2 rounded">
        <h1 className="text-2xl font-bold mb-4">Disaster Event Survey</h1>

        {step === 1 && (
          <>
            <Label className="text-sm text-gray-500">Event Name<span className="redstar">*</span></Label>
            <Input name="Name" value={formData.Name} onChange={onChange} placeholder="Event Name" />

            <Label className="text-sm text-gray-500 mt-4 mb-3">Select Disaster Type<span className="redstar">*</span></Label>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
              {disasterTypes.map((type) => {
                const isSelected = formData.DisasterTypeId === type.id;
                const bgImage = disasterTypeImages[type.id];

                return (
                  <Card
                    key={type.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, DisasterTypeId: type.id }))
                    }
                    className={`cursor-pointer border ${isSelected ? "border-blue-500 border-2" : "border-gray-300"
                      }`}
                    style={
                      bgImage
                        ? {
                          backgroundImage: `url(${bgImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
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
              })}
            </div>

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

      {/* RIGHT: Sidebar with Pending Reports */}
      <aside className="w-110 max-h-180 overflow-y-auto border rounded p-4 shadow-md bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Pending Reports</h2>
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white font-bold">
            {pendingReports.length}
          </span>
        </div>

        {pendingReports.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending reports.</p>
        ) : (
          <div className="space-y-3">
            {pendingReports.map((report) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case "Confirmed": return "bg-green-400 text-green-800";
                  case "Rejected": return "bg-red-500 text-red-800";
                  case "Fake": return "bg-gray-400 text-white";
                  default: return "bg-yellow-300 text-gray-800";
                }
              };

              const handleReject = async () => {
                setLoadingMap(prev => ({ ...prev, [report.id]: true }));
                try {
                  const result = await approveDisapproveReport(report.id, false);
                  if (result.isSuccess) {
                    toast.success("Report rejected");
                    setPendingReports(prev =>
                      prev.map(r => (r.id === report.id ? { ...r, status: "Rejected" } : r))
                    );
                  } else {
                    toast.error(result.message || "Action failed");
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Action failed");
                } finally {
                  setLoadingMap(prev => ({ ...prev, [report.id]: false }));
                }
              };

              const handleUnreject = async () => {
                setLoadingMap(prev => ({ ...prev, [report.id]: true }));
                try {
                  const result = await unrejectReport(report.id);
                  if (result.isSuccess) {
                    toast.success("Report set back to pending");
                    setPendingReports(prev =>
                      prev.map(r => (r.id === report.id ? { ...r, status: "Pending" } : r))
                    );
                  } else {
                    toast.error(result.message || "Action failed");
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Action failed");
                } finally {
                  setLoadingMap(prev => ({ ...prev, [report.id]: false }));
                }
              };

              const handleMarkChecked = async () => {
                setLoadingMap(prev => ({ ...prev, [report.id]: true }));
                try {
                  const result = await markReportChecked(report.id);
                  if (result.isSuccess) {
                    toast.success("Report marked as checked");
                    setPendingReports(prev =>
                      prev.map(r => (r.id === report.id ? { ...r, status: "Checked" } : r))
                    );
                  } else {
                    toast.error(result.message || "Action failed");
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Action failed");
                } finally {
                  setLoadingMap(prev => ({ ...prev, [report.id]: false }));
                }
              };

              return (
                <Card key={report.id} className="border shadow-sm">
                  <CardContent className="px-3">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-sm">{report.title}</h3>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{report.description}</p>

                    {/* Location */}
                    <div className="flex flex-wrap items-center space-x-1 text-gray-600 min-w-0">
                      <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="font-medium text-wrap">{report.location?.name || "Unknown Location"}</span>
                    </div>

                    {/* Severity + Type */}
                    <div className="flex justify-between mt-2 mb-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-white ${report.severity === "Critical" ? "bg-red-600" :
                            report.severity === "High" ? "bg-orange-500" :
                              report.severity === "Medium" ? "bg-yellow-400 text-black" :
                                "bg-green-500"
                          }`}>
                          {report.severity}
                        </span>
                        <span className="px-1 py-1 rounded text-xs bg-black text-white">{report.type}</span>
                      </div>
                      <span className="text-gray-500">{format(new Date(report.createdAt), "MMM d, yyyy")}</span>
                    </div>

                    {/* Source */}
                    <div className="flex items-center space-x-2 text-xs max-w-fit">
                      <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-700 truncate max-w-32">{report.source || "Unknown Source"}</span>
                      <span className="text-xs bg-green-500 text-white rounded-full px-2 m-1 py-0.5 font-bold flex-shrink-0">SOURCE</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {report.status !== "Rejected" && report.status !== "Checked" && (
                        <Button
                          size="sm"
                          onClick={handleReject}
                          disabled={!!loadingMap[report.id]}
                          className="bg-red-50 text-red-600 border border-red-200"
                        >
                          Reject
                        </Button>
                      )}
                      {report.status === "Rejected" && (
                        <Button
                          size="sm"
                          onClick={handleUnreject}
                          disabled={loadingMap[report.id]}
                          className="bg-blue-50 text-blue-600 border border-blue-200"
                        >
                          Un-reject
                        </Button>
                      )}
                      {report.status !== "Checked" && (
                        <Button
                          size="sm"
                          onClick={handleMarkChecked}
                          disabled={loadingMap[report.id]}
                          className="bg-green-50 text-green-600 border border-green-200"
                        >
                          Mark Checked
                        </Button>
                      )}

                      {report.status !== "Fake" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/reports/${report.id}`)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400 font-medium text-xs px-2 py-1 h-7"
                        >
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </aside>
    </div >
  );
}
