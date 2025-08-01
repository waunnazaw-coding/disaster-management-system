import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { MapPin, Calendar, Users, AlertTriangle, ArrowLeft, Building2 } from "lucide-react";
import api from "../../api/axioInstance";
import { Button } from "../../components/ui/button";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import { ConfirmModal } from "@/components/Comfirm";

interface EventDetails {
    id: number;
    name: string;
    description?: string;
    locationName: string;
    startDate: string;
    severity: string;
    status: string;
    affectedPeople: number;
    disasterTypeName: string;
    region?: string;
    country?: string;
    locationGeoJson?: any;
}

const EventDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await api.get(`/DisasterEvent/withlocation/${id}`);
                const data = response.data?.data || response.data;

                setEvent({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    locationName: data.locationName,
                    startDate: data.startDate,
                    severity: data.severity || "Low",
                    status: data.status,
                    affectedPeople: data.affectedPeople || 0,
                    disasterTypeName: data.disasterTypeName,
                    region: data.region,
                    country: data.country,
                    locationGeoJson: data.locationGeoJson,
                });
            } catch (err) {
                console.error("Error fetching event details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEventDetails();
    }, [id]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Critical":
                return "bg-red-500";
            case "High":
                return "bg-orange-500";
            case "Medium":
                return "bg-yellow-500";
            default:
                return "bg-green-500";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-300 text-green-800 border-green-200";
            case "Closed":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-blue-600 font-semibold text-lg">Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <AlertTriangle className="text-red-500 w-10 h-10 mb-3" />
                <p className="text-gray-600 text-lg">Event not found.</p>
                <Button className="mt-4" onClick={() => navigate("/disaster/events")}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto flex flex-col space-y-4">
                <div>
                    <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                        onClick={() => navigate("/disaster/events")}
                    >
                        <ArrowLeft className="h-4 w-4" /> <span>Back</span>
                    </Button>

                    <Card className="shadow-lg rounded-xl border-0 bg-white">
                        <div className="relative h-90 rounded-t-xl overflow-hidden">
                            <DisasterMap
                                geojsonData={event.locationGeoJson ? JSON.parse(event.locationGeoJson) : null}
                                viewOnly={true}
                            />
                            <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`} />
                                <Badge variant="outline" className={`${getStatusColor(event.status)} font-medium`}>
                                    {event.status}
                                </Badge>
                            </div>

                            <div className="absolute bottom-4 left-4">
                                <AlertTriangle
                                    className="h-8 w-8 text-red-700"
                                    style={{ filter: "drop-shadow(0 0 5px red)" }}
                                />
                            </div>
                        </div>

                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-blue-900">{event.name}</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <p className="text-gray-700 text-lg">{event.description || "No description provided."}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 text-sm text-blue-600">
                                    <MapPin className="h-5 w-5 text-green-500" />
                                    <span>
                                        {event.locationName} {event.region && `(${event.region})`} {event.country && `- ${event.country}`}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-blue-600">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-blue-600">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                    <span>{event.affectedPeople.toLocaleString()} people affected</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-blue-600">
                                    <Building2 className="h-5 w-5 text-gray-500" />
                                    <span>Disaster Type: {event.disasterTypeName}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default EventDetailsPage;
