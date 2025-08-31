import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  MapPinned,
  Calendar,
  Users,
  User,
  AlertTriangle,
  Heart,
  Bookmark,
  Building2,
  BanknoteArrowDown,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDisasterStore } from "../../store/disasterStore";
import { useNavigate } from "react-router-dom";
import "@/styles/new.css";

const disasterTypes = [
  "All Type",
  "Earthquake",
  "Flood",
  "Hurricane",
  "Tornado",
  "Wildfire",
  "Landslide",
  "Volcanic Eruption",
  "Drought",
  "Pandemic",
  "Chemical Spill",
  "Nuclear Accident",
  "Cyber Attack",
  "Terrorism",
  "Industrial Accident",
];

function DisasterEventsForAdmin() {
  const { filteredEvents, fetchEvents, filterEvents, setSearchQuery } =
    useDisasterStore();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setSearchQuery(searchText);
    filterEvents(typeFilter, sortOrder);
    setPage(1);
  }, [searchText, typeFilter, sortOrder, setSearchQuery, filterEvents]);

  const totalPages = Math.ceil(filteredEvents.length / limit);
  const paginatedEvents = filteredEvents.slice((page - 1) * limit, page * limit);

  const getSeverityColor = (severity: string) =>
  ({
    Critical: "text-red-600 animate-pulse font-bold",
    High: "text-orange-500 animate-pulse font-bold",
    Medium: "text-yellow-500 animate-pulse font-bold",
    Low: "text-green-500 animate-pulse font-bold",
  }[severity] || "text-green-500");

  const getStatusColor = (status: string) =>
  ({
    Active: "bg-green-300 text-white-800 border-red-200",
    Closed: "bg-red-100 text-orange-800 border-orange-200",
  }[status] || "bg-gray-100 text-gray-800 border-gray-200");

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center h-20 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Disaster Events</h2>
            <p className="mt-2 text-sm text-gray-600">
              Current verified disasters requiring attention and support.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-black h-11 text-white hover:bg-white hover:text-black hover:border hover:border-black"
              onClick={() => navigate("/events/mapView")}
            >
              <MapPinned />
              Map View
            </Button>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-wrap gap-4 items-center mt-6 mb-8">
          <input
            type="text"
            placeholder="Search by event title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border-2 text-sm flex-1 min-w-[200px] active:border-black"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg text-sm focus:border-black border-2"
          >
            {disasterTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
            className="bg-white px-3 py-2 rounded-lg text-sm focus:border-black border-2"
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
          </select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((event) => (
              <Card
                key={event.id}
                className="group gap-3 border-0 shadow-lg pt-0 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-xl flex flex-col justify-between"
              >
                {/* Title + Description */}
                <CardHeader className="px-0">
                  {/* Image + Status + Severity */}
                  <div
                    className="h-50 relative bg-gray-200"
                    style={{
                      backgroundImage: event.firstImageUrl
                        ? `url(${event.firstImageUrl})`
                        : "linear-gradient(to right, #1e3a8a, #2563eb)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(event.status)} font-medium`}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute bottom-4 right-4">
                            <AlertTriangle
                              className={`h-8 w-8 ${getSeverityColor(event.severity)}`}
                              style={{ filter: "drop-shadow(0 0 5px red)" }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Severity: {event.severity}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardTitle className="px-6 flex justify-between text-xl font-bold text-blue-900 group-hover:text-blue-600">
                    {event.title}
                    <span className="text-xs bg-red-100 text-red-700 rounded h-5 mt-2 px-2 font-semibold">
                      {event.disasterTypeName || "N/A"}
                    </span>
                  </CardTitle>
                  <CardDescription className="px-5 text-blue-700 line-clamp-2 indent-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                {/* Info + Footer */}
                <CardContent className="space-y-4">
                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-blue-600">
                      <MapPin className="h-6 w-6 text-green-500" />
                      <span className="text-xs">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-blue-600">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>
                        <b className="text-indigo-700">Event occurred date:</b>{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2 text-sm text-orange-600">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <User className="h-4 w-4 text-indigo-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>Affected people</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="font-extrabold">
                          {event.affectedPeople.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-orange-600">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Building2 className="h-4 w-4 text-indigo-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>Infrastructural damages</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="font-extrabold">
                          {event.affectedInfractructures.toLocaleString()}
                        </span>
                      </div>

                      {event.affectedFamilies > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-orange-600">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Users className="h-4 w-4 text-indigo-500 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent>Affected families</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="font-extrabold">
                            {event.affectedFamilies.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {event.currencyChanges.length > 0 && (
                        <div className="flex items-center space-x-3 text-sm text-orange-600">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <BanknoteArrowDown className="h-4 w-4 text-indigo-500 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent>Financial Loss</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="font-bold">
                            {event.currencyChanges.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Footer */}
                <div className="pt-4 border-t border-blue-100 space-y-2 px-5 w-full">
                  <div className="flex items-center justify-between text-xs text-blue-500">
                    <div className="flex gap-1">
                      <div className="w-8 h-9 bg-blue-600 rounded-b-full flex items-center justify-center shadow ml-1">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold">
                        <div className="text-sm text-blue-800">
                          {event.createdUserName || "Unknown"}
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            {event.createdAt
                              ? new Date(event.createdAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Bookmark className="h-4 w-4 text-red-400 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Save</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-700"
                      onClick={() => navigate(`/disasters/${event.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 col-span-full">
              <AlertTriangle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Events
              </h3>
              <p className="text-gray-500">
                There are currently no disaster events matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default DisasterEventsForAdmin;
