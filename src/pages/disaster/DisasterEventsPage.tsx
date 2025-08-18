import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MapPin, Calendar, Users, User, AlertTriangle, Heart, Bookmark, Building, DollarSign, Shield } from "lucide-react";
import { useDisasterStore } from "../../store/disasterStore";
import { useNavigate } from "react-router-dom";
import "@/styles/new.css"

function DisasterEventsForAdmin() {
    const { events, fetchEvents } = useDisasterStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Critical":
                return "text-red-600 animate-pulse font-bold";
            case "High":
                return "text-orange-500 animate-pulse font-bold";
            case "Medium":
                return "text-yellow-500 animate-pulse font-bold";
            default:
                return "text-light-green-500 animate-pulse font-bold";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-300 text-white-800 border-red-200";
            case "Closed":
                return "bg-red-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-[1500px] mx-auto">
                {/* Title and Create Button Row */}
                <div className="flex justify-center items-center mb-12">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">Active Disaster Events</h2>
                        <p className="text-xl text-blue-700 max-w-3xl">
                            Current verified disasters requiring attention and support. Each event is created from community reports and verified by our admin team.
                        </p>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <Card
                                key={event.id}
                                className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-xl"
                            >
                                <div
                                    className="h-48 relative bg-gray-200"
                                    style={{
                                        backgroundImage: event.firstImageUrl
                                            ? `url(${event.firstImageUrl})`
                                            : "linear-gradient(to right, #1e3a8a, #2563eb)",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >

                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="absolute top-4 right-4 flex items-center space-x-2 ">
                                        <Badge variant="outline" className={`${getStatusColor(event.status)} font-medium`}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="absolute bottom-4 right-4">
                                                    <AlertTriangle className={`h-8 w-8 ${getSeverityColor(event.severity)}`} style={{ filter: "drop-shadow(0 0 5px red)" }} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Severity: {event.severity}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <CardHeader className="">
                                    <CardTitle className="flex justify-between text-xl font-bold text-blue-900 group-hover:text-blue-600 transition-colors">
                                        {event.title}
                                        <span
                                            className="text-xs bg-red-100 text-red-700 rounded h-5 mt-2 px-2 font-semibold"
                                            aria-label="Type"
                                        >
                                            {event.disasterTypeName || "N/A"}
                                        </span>
                                    </CardTitle>

                                    <CardDescription className="text-blue-700 line-clamp-2 indent-3">{event.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 text-blue-600">
                                            <MapPin className="text-lg h-8 w-6 text-green-500" />
                                            <span className="text-xs">{event.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-blue-600">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            <span>Started Date: {new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-orange-600">
                                            <User className="h-4 w-4 text-indigo-500" />
                                            <span>({event.affectedPeople.toLocaleString()}) People affected</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-orange-600">
                                            <Building className="h-4 w-4 text-indigo-500" />
                                            <span>({event.affectedInfractructures.toLocaleString()}) Infractructural Damages</span>
                                        </div>
                                        {event.affectedFamilies > 0 && (
                                            <div className="flex items-center space-x-3 text-sm text-orange-600">
                                                <Users className="h-4 w-4 text-indigo-500" />
                                                <span>({event.affectedFamilies.toLocaleString()}) Families affected</span>
                                            </div>
                                        )}
                                        {event.currencyChanges.length > 0 && (
                                            <div className="flex items-center space-x-3 text-sm text-orange-600">
                                                <DollarSign className="h-4 w-4 text-indigo-500" />
                                                <span>{event.currencyChanges.join(", ")} ~ Economical Loss</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between pt-2 border-t border-blue-100 text-xs text-blue-500">
                                            <div className="flex gap-1">
                                                <div className="w-8 h-9 bg-blue-600 rounded-b-full flex items-center justify-center shadow ml-1 mr-0.5">
                                                    <Shield className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="font-semibold">
                                                    <div className="text-sm text-blue-800">
                                                        {event.createdUserName || "Unknown"}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500">
                                                            {event.createdAt
                                                                ? new Date(event.createdAt).toLocaleString(undefined, {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })
                                                                : "N/A"}
                                                        </span>
                                                        <span> . </span>
                                                        <span
                                                            className="text-xs bg-gray-200 text-gray-500 rounded px-1 py-0.5 font-semibold"
                                                            aria-label="Type"
                                                        >
                                                            published
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Bookmark className="h-4 w-4 text-red-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Save</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 pt-4">
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-blue-700 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                                                onClick={() => navigate(`/disasters/${event.id}`)}
                                            >
                                                <Heart className="h-4 w-4 mr-2" />
                                                Request Help
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                                                onClick={() => navigate(`/disasters/${event.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-16 col-span-full">
                            <AlertTriangle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Events</h3>
                            <p className="text-gray-500">There are currently no active disaster events requiring assistance.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default DisasterEventsForAdmin;
