import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityStore } from "@/store/activityStore";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Users,
  CalendarDays,
  CircleDollarSign,
  PlayCircle,
  Clock,
  Heart,
  Building2,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Video from "yet-another-react-lightbox/plugins/video";

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentActivity, fetchActivity, loading } = useActivityStore();
  const activityId = Number.parseInt(id || "0", 10);

  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  React.useEffect(() => {
    if (activityId) fetchActivity(activityId);
  }, [activityId, fetchActivity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-96 w-full rounded-3xl" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64 w-full rounded-3xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Activity not found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The activity you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/activities")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-medium"
          >
            Browse All Activities
          </Button>
        </div>
      </div>
    );
  }

  const slides = currentActivity.media.map((m) =>
    m.isVideo
      ? ({
          type: "video",
          width: 1280,
          height: 720,
          sources: [{ src: m.filePath, type: "video/mp4" }],
          title: currentActivity.title,
          description: currentActivity.reliefTeamName || "",
        } as any)
      : ({
          src: m.filePath,
          alt: currentActivity.title,
          title: currentActivity.title,
          description: currentActivity.reliefTeamName || "",
        } as any)
  );

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const hero = currentActivity.media[0]?.filePath;

  const onShare = async () => {
    const url = window.location.href;
    const text = currentActivity.title;
    try {
      if (navigator.share) {
        await navigator.share({ title: text, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {}
  };

  const activityTypeColors: Record<string, string> = {
    Rescue: "from-red-500 to-red-600",
    Donation: "from-emerald-500 to-emerald-600",
    Support: "from-blue-500 to-blue-600",
    default: "from-gray-500 to-gray-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-8 text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded-2xl px-6 py-3 font-medium"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Activities
        </Button>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-12">
            <div className="relative h-96 w-full">
              {hero ? (
                <img
                  src={hero || "/placeholder.svg"}
                  alt={currentActivity.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`h-full w-full bg-gradient-to-br ${
                    activityTypeColors[currentActivity.activityType] ||
                    activityTypeColors.default
                  }`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />

              {/* Hero Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div className="text-white max-w-4xl">
                    <div className="mb-4 flex items-center gap-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${
                          activityTypeColors[currentActivity.activityType] ||
                          activityTypeColors.default
                        } px-4 py-2 text-sm font-bold text-white shadow-lg`}
                      >
                        {currentActivity.activityType}
                      </span>
                      <div className="flex items-center gap-2 text-white/90">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {format(
                            new Date(currentActivity.activityDate),
                            "MMMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-3 leading-tight">
                      {currentActivity.title}
                    </h1>
                    {currentActivity.reliefTeamName && (
                      <p className="text-xl text-white/90 font-medium">
                        {currentActivity.reliefTeamName}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={onShare}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-2xl px-6 py-3"
                  >
                    <Share2 className="h-5 w-5 mr-2" /> Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Activity
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {currentActivity.description}
                </p>
              </div>

              {/* Media Gallery */}
              {currentActivity.media.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Activity Gallery
                  </h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    {currentActivity.media.map((m, idx) => (
                      <button
                        key={m.id}
                        className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => openLightboxAt(idx)}
                        aria-label="Open media"
                      >
                        {m.isVideo ? (
                          <>
                            <video
                              src={m.filePath}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:opacity-80">
                              <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
                            </div>
                          </>
                        ) : (
                          <img
                            src={m.filePath || "/placeholder.svg"}
                            alt={`Media ${m.id}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={slides}
                    plugins={[Thumbnails, Fullscreen, Captions, Video]}
                    thumbnails={{ showToggle: true }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Activity Details
                </h3>

                {[
                  {
                    icon: CalendarDays,
                    title: "Date",
                    value: format(
                      new Date(currentActivity.activityDate),
                      "MMMM d, yyyy"
                    ),
                    bg: "bg-blue-100",
                    color: "text-blue-600",
                  },
                  {
                    icon: Building2,
                    title: "Relief Team",
                    value: currentActivity.reliefTeamName,
                    bg: "bg-indigo-100",
                    color: "text-indigo-600",
                  },
                  {
                    icon: User,
                    title: "Posted By",
                    value: currentActivity.postedByUserName,
                    bg: "bg-purple-100",
                    color: "text-purple-600",
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    value: currentActivity.detailedAddress,
                    bg: "bg-emerald-100",
                    color: "text-emerald-600",
                  },
                  {
                    icon: Users,
                    title: "People Helped",
                    value:
                      typeof currentActivity.peopleHelped === "number"
                        ? `${currentActivity.peopleHelped.toLocaleString()} individuals`
                        : null,
                    bg: "bg-purple-100",
                    color: "text-purple-600",
                  },
                  {
                    icon: CircleDollarSign,
                    title: "Resources",
                    value:
                      typeof currentActivity.expenseAmount === "number"
                        ? `$${currentActivity.expenseAmount.toLocaleString()} invested`
                        : null,
                    bg: "bg-amber-100",
                    color: "text-amber-600",
                  },
                ].map(
                  (item, idx) =>
                    item.value && (
                      <div className="flex items-start gap-4" key={idx}>
                        <div
                          className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                        >
                          <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600">{item.value}</p>
                        </div>
                      </div>
                    )
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-3">Get Involved</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Want to support similar relief activities? Join our community
                  and make a difference.
                </p>
                <Button
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-2xl transition-all duration-200"
                  onClick={() => navigate("/get-involved")}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
