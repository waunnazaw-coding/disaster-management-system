

import type React from "react"
import type { ReliefTeamActivityDTO } from "@/types/activity"
import { format } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye, Loader2, Users, MapPin } from "lucide-react"
import clsx from "clsx"
import { useState } from "react"

interface ActivityCardProps {
  activity: ReliefTeamActivityDTO;
  onView: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  // Make onDelete required
  onDelete?: () => void;
  isDeleting?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onView,
  isAdmin = false,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const [localDeleting, setLocalDeleting] = useState(false);

  const handleDelete = async () => {
    setLocalDeleting(true);
    try {
      // Safety check before calling
      if (onDelete) {
        await onDelete();
      }
    } finally {
      setLocalDeleting(false);
    }
  };

  const badgeColors: Record<string, string> = {
    Rescue: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    Donation: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg",
    Support: "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg",
    default: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
  }

  const hasMedia = activity.media && activity.media.length > 0
  const heroImage = hasMedia ? activity.media[0]?.filePath : null

  return (
    <Card className="group overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-2 flex flex-col h-full">
      {/* Hero Image or Gradient */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {heroImage ? (
          <img
            src={heroImage || "/placeholder.svg"}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-400 via-red-500 to-red-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Activity Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm",
              badgeColors[activity.activityType] || badgeColors.default,
            )}
          >
            {activity.activityType}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800 shadow-md">
            {format(new Date(activity.activityDate), "MMM dd")}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <CardHeader className="pb-3 pt-5 flex-shrink-0">
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight min-h-[3.5rem]">
            {activity.title}
          </CardTitle>

          {/* Team and Location Info */}
          <div className="flex flex-col gap-2 text-sm text-gray-600 mt-3">
            {activity.reliefTeamName && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="font-medium truncate">ReliefTeam-{activity.reliefTeamName}</span>
              </div>
            )}
            {activity.postedByUserName && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="font-medium truncate">PostBy-{activity.postedByUserName}</span>
              </div>
            )}
            {activity.detailedAddress && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="truncate">{activity.detailedAddress}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-4 flex-1 flex flex-col">
          <p className="text-gray-700 line-clamp-3 leading-relaxed flex-1">
            {activity.description}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t border-gray-200 pt-4 bg-gray-50/50 flex-shrink-0">
          <Button
            onClick={onView}
            className={clsx(
              "flex-1 font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg",
              isAdmin
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white",
            )}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {isAdmin && (
            <div className="flex gap-2 ml-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="p-3 border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 bg-white"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={localDeleting || isDeleting}
                className="p-3 border-gray-300 hover:border-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 disabled:opacity-50 bg-white"
              >
                {(localDeleting || isDeleting) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}

export default ActivityCard

// export default ActivityCard
