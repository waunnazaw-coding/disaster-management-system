


// import React from 'react';
// import { ReliefTeamActivityDTO } from '@/types/activity';
// import { format } from 'date-fns';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Pencil, Trash2, Eye, Loader2 } from 'lucide-react';


// interface ActivityCardProps {
//   activity: ReliefTeamActivityDTO;
//   onView: () => void;
//   isAdmin?: boolean;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   isDeleting?: boolean;
// }

// const ActivityCard: React.FC<ActivityCardProps> = ({ 
//    activity, 
//   onView, 
//   isAdmin = false,
//   onEdit, 
//   onDelete,
//   isDeleting
// }) => {
//   return (
//     <Card className="hover:shadow-lg transition-shadow duration-300">
//       <CardHeader>
//         <div className="flex justify-between items-start">
//           <CardTitle className="text-lg font-semibold truncate">
//             {activity.title}
//           </CardTitle>
//           <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//             {activity.activityType}
//           </span>
//         </div>
//         <div className="text-sm text-gray-500">
//           {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
//           {activity.reliefTeamName && ` • ${activity.reliefTeamName}`}
//         </div>
//       </CardHeader>
      
//       <CardContent className="pb-2">
//         <p className="text-gray-700 line-clamp-2">
//           {activity.description}
//         </p>
        
//         {activity.peopleHelped && (
//           <div className="mt-2 flex items-center">
//             <span className="text-sm font-medium text-gray-900">
//               {activity.peopleHelped} people helped
//             </span>
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-between pt-4 border-t mt-auto">
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={onView}
//           className="flex-1"
//         >
//           <Eye className="h-4 w-4 mr-1" /> View Details
//         </Button>
        
//         {isAdmin && (
//           <div className="flex space-x-2 ml-4">
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={onEdit}
//               className="px-3"
//             >
//               <Pencil className="h-4 w-4" />
//             </Button>
//             <Button 
//               variant="destructive" 
//               size="sm" 
//               onClick={onDelete}
//               disabled={isDeleting}
//               className="px-3"
//             >
//               {isDeleting ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Trash2 className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default ActivityCard;



// import React from 'react';
// import { ReliefTeamActivityDTO } from '@/types/activity';
// import { format } from 'date-fns';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Pencil, Trash2, Eye, Loader2, Calendar, Users } from 'lucide-react';
// import clsx from 'clsx';

// interface ActivityCardProps {
//   activity: ReliefTeamActivityDTO;
//   onView: () => void;
//   isAdmin?: boolean;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   isDeleting?: boolean;
// }

// const ActivityCard: React.FC<ActivityCardProps> = ({
//   activity,
//   onView,
//   isAdmin = false,
//   onEdit,
//   onDelete,
//   isDeleting
// }) => {
//   const badgeColors: Record<string, string> = {
//     Rescue: 'bg-red-100 text-red-800',
//     Donation: 'bg-green-100 text-green-800',
//     Support: 'bg-blue-100 text-blue-800',
//     default: 'bg-gray-100 text-gray-800'
//   };

//   return (
//     <Card className="hover:shadow-xl border border-gray-100 rounded-xl transition-all duration-300 bg-white">
//       <CardHeader className="pb-3">
//         <div className="flex justify-between items-start">
//           <CardTitle className="text-xl font-bold text-gray-900 truncate">
//             {activity.title}
//           </CardTitle>
//           <span
//             className={clsx(
//               'px-3 py-1 rounded-full text-xs font-semibold',
//               badgeColors[activity.activityType] || badgeColors.default
//             )}
//           >
//             {activity.activityType}
//           </span>
//         </div>
//         <div className="flex items-center mt-2 text-sm text-gray-500 space-x-2">
//           <Calendar className="h-4 w-4" />
//           <span>{format(new Date(activity.activityDate), 'MMM dd, yyyy')}</span>
//           {activity.reliefTeamName && (
//             <>
//               <span className="text-gray-400">•</span>
//               <span className="font-medium">{activity.reliefTeamName}</span>
//             </>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="pb-4">
//         <p className="text-gray-700 line-clamp-3">
//           {activity.description}
//         </p>

//         {activity.peopleHelped && (
//           <div className="mt-3 flex items-center text-gray-700">
//             <Users className="h-4 w-4 mr-1" />
//             <span className="text-sm font-medium">
//               {activity.peopleHelped} people helped
//             </span>
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="flex justify-between items-center border-t pt-4">
//         <Button
//           variant="default"
//           size="sm"
//           onClick={onView}
//           className="flex-1 font-medium hover:scale-[1.02] transition-transform"
//         >
//           <Eye className="h-4 w-4 mr-2" /> View Details
//         </Button>

//         {isAdmin && (
//           <div className="flex space-x-2 ml-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onEdit}
//               className="px-3 hover:border-blue-400 hover:text-blue-600"
//             >
//               <Pencil className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={onDelete}
//               disabled={isDeleting}
//               className="px-3"
//             >
//               {isDeleting ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Trash2 className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default ActivityCard;

// "use client"

// import type React from "react"
// import type { ReliefTeamActivityDTO } from "@/types/activity"
// import { format } from "date-fns"
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Pencil, Trash2, Eye, Loader2, Users, MapPin, DollarSign } from "lucide-react"
// import clsx from "clsx"

// interface ActivityCardProps {
//   activity: ReliefTeamActivityDTO
//   onView: () => void
//   isAdmin?: boolean
//   onEdit?: () => void
//   onDelete?: () => void
//   isDeleting?: boolean
// }

// const ActivityCard: React.FC<ActivityCardProps> = ({
//   activity,
//   onView,
//   isAdmin = false,
//   onEdit,
//   onDelete,
//   isDeleting,
// }) => {
//   const badgeColors: Record<string, string> = {
//     Rescue: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
//     Donation: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg",
//     Support: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
//     default: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
//   }

//   const hasMedia = activity.media && activity.media.length > 0
//   const heroImage = hasMedia ? activity.media[0]?.filePath : null

//   return (
//     <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl transform hover:-translate-y-2">
//       {/* Hero Image or Gradient */}
//       <div className="relative h-48 overflow-hidden">
//         {heroImage ? (
//           <img
//             src={heroImage || "/placeholder.svg"}
//             alt={activity.title}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600" />
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//         {/* Activity Type Badge */}
//         <div className="absolute top-4 left-4">
//           <span
//             className={clsx(
//               "px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm",
//               badgeColors[activity.activityType] || badgeColors.default,
//             )}
//           >
//             {activity.activityType}
//           </span>
//         </div>

//         {/* Date Badge */}
//         <div className="absolute top-4 right-4">
//           <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-semibold text-gray-700">
//             {format(new Date(activity.activityDate), "MMM dd")}
//           </div>
//         </div>
//       </div>

//       <CardHeader className="pb-3 pt-6">
//         <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">{activity.title}</CardTitle>

//         {/* Team and Location Info */}
//         <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
//           {activity.reliefTeamName && (
//             <div className="flex items-center gap-1">
//               <Users className="h-4 w-4" />
//               <span className="font-medium truncate">{activity.reliefTeamName}</span>
//             </div>
//           )}
//           {activity.postedByUserName && (
//             <div className="flex items-center gap-1">
//               <Users className="h-4 w-4" />
//               <span className="font-medium truncate">{activity.postedByUserName}</span>
//             </div>
//           )}
//           {activity.detailedAddress && (
//             <div className="flex items-center gap-1">
//               <MapPin className="h-4 w-4" />
//               <span className="truncate">{activity.detailedAddress}</span>
//             </div>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="pb-4">
//         <p className="text-gray-700 line-clamp-3 leading-relaxed">{activity.description}</p>

//         {/* Stats Row */}
//         <div className="mt-4 flex items-center justify-between">
//           {activity.peopleHelped && (
//             <div className="flex items-center gap-2 text-emerald-600">
//               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//               <span className="text-sm font-semibold">{activity.peopleHelped} helped</span>
//             </div>
//           )}

//           {activity.expenseAmount && (
//             <div className="flex items-center gap-2 text-amber-600">
//               <DollarSign className="h-4 w-4" />
//               <span className="text-sm font-semibold">${activity.expenseAmount.toLocaleString()}</span>
//             </div>
//           )}
//         </div>
//       </CardContent>

//       <CardFooter className="flex justify-between items-center border-t border-gray-50 pt-6 bg-gray-50/50">
//         <Button
//           onClick={onView}
//           className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
//         >
//           <Eye className="h-4 w-4 mr-2" />
//           View Details
//         </Button>

//         {isAdmin && (
//           <div className="flex gap-2 ml-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onEdit}
//               className="p-3 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 bg-transparent"
//             >
//               <Pencil className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onDelete}
//               disabled={isDeleting}
//               className="p-3 border-gray-200 hover:border-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 bg-transparent"
//             >
//               {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
//             </Button>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   )
// }

// export default ActivityCard


"use client"

import type React from "react"
import type { ReliefTeamActivityDTO } from "@/types/activity"
import { format } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye, Loader2, Users, MapPin, DollarSign, Currency, DollarSignIcon } from "lucide-react"
import clsx from "clsx"

interface ActivityCardProps {
  activity: ReliefTeamActivityDTO
  onView: () => void
  isAdmin?: boolean
  onEdit?: () => void
  onDelete?: () => void
  isDeleting?: boolean
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onView,
  isAdmin = false,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const badgeColors: Record<string, string> = {
    Rescue: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    Donation: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg",
    Support: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
    default: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
  }

  const hasMedia = activity.media && activity.media.length > 0
  const heroImage = hasMedia ? activity.media[0]?.filePath : null

  return (
    <Card className="group overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-1 max-w-sm w-full">
      {/* Hero Image or Gradient */}
      <div className="relative h-56 overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage || "/placeholder.svg"}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Activity Type Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm",
              badgeColors[activity.activityType] || badgeColors.default,
            )}
          >
            {activity.activityType}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700">
            {format(new Date(activity.activityDate), "MMM dd")}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3 pt-6">
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
          {activity.title}
        </CardTitle>

        {/* Team and Location Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
          {activity.reliefTeamName && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium truncate">{activity.reliefTeamName}</span>
            </div>
          )}
          {activity.postedByUserName && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium truncate">{activity.postedByUserName}</span>
            </div>
          )}
          {activity.detailedAddress && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{activity.detailedAddress}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-gray-700 line-clamp-3 leading-relaxed">{activity.description}</p>

        {/* Stats Row */}
        <div className="mt-4 flex items-center justify-between">
          {activity.peopleHelped && (
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold">{activity.peopleHelped} helped</span>
            </div>
          )}

          {activity.expenseAmount && (
            <div className="flex items-center gap-2 text-amber-600">
            <DollarSignIcon className="h-4 w-4" />
              <span className="text-sm font-semibold">{activity.expenseAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t border-gray-100 pt-5 bg-gray-50">
        <Button
          onClick={onView}
          className={clsx(
            "flex-1 font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg",
            isAdmin
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
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
              className="p-3 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 bg-transparent"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="p-3 border-gray-200 hover:border-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 bg-transparent"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default ActivityCard


// "use client"

// import type React from "react"
// import type { ReliefTeamActivityDTO } from "@/types/activity"
// import { format } from "date-fns"
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Pencil, Trash2, Eye, Loader2, Users, MapPin, DollarSign } from "lucide-react"
// import clsx from "clsx"

// interface ActivityCardProps {
//   activity: ReliefTeamActivityDTO
//   onView: () => void
//   isAdmin?: boolean
//   onEdit?: () => void
//   onDelete?: () => void
//   isDeleting?: boolean
//   /** Optional Tailwind height utility (e.g. "h-[560px]") */
//   heightClass?: string
// }

// const ActivityCard: React.FC<ActivityCardProps> = ({
//   activity,
//   onView,
//   isAdmin = false,
//   onEdit,
//   onDelete,
//   isDeleting,
//   heightClass,
// }) => {
//   const badgeColors: Record<string, string> = {
//     Rescue: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
//     Donation: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg",
//     Support: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
//     default: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
//   }

//   const hasMedia = activity.media && activity.media.length > 0
//   const heroImage = hasMedia ? activity.media[0]?.filePath : null

//   // Default equal height (tweak as you like)
//   const fixedHeight = heightClass ?? "h-[540px] md:h-[560px]"

//   return (
//     <Card
//       className={clsx(
//         "group relative overflow-hidden border border-gray-100 shadow-md hover:shadow-xl",
//         "transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-1",
//         "max-w-sm w-full",
//         "flex flex-col", // 1) column layout
//         fixedHeight // 2) equal height for all cards
//       )}
//     >
//       {/* Hero Image or Gradient */}
//       <div className="relative h-52 md:h-56 overflow-hidden">
//         {heroImage ? (
//           <img
//             src={heroImage || "/placeholder.svg"}
//             alt={activity.title}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600" />
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//         {/* Activity Type Badge */}
//         <div className="absolute top-4 left-4">
//           <span
//             className={clsx(
//               "px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm",
//               badgeColors[activity.activityType] || badgeColors.default
//             )}
//           >
//             {activity.activityType}
//           </span>
//         </div>

//         {/* Date Badge */}
//         <div className="absolute top-4 right-4">
//           <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700">
//             {format(new Date(activity.activityDate), "MMM dd")}
//           </div>
//         </div>
//       </div>

//       {/* Content area */}
//       <CardHeader className="pb-3 pt-6">
//         <CardTitle className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
//           {activity.title}
//         </CardTitle>

//         {/* Team and Location Info */}
//         <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
//           {activity.reliefTeamName && (
//             <div className="flex items-center gap-1">
//               <Users className="h-4 w-4" />
//               <span className="font-medium truncate">{activity.reliefTeamName}</span>
//             </div>
//           )}
//           {activity.postedByUserName && (
//             <div className="flex items-center gap-1">
//               <Users className="h-4 w-4" />
//               <span className="font-medium truncate">{activity.postedByUserName}</span>
//             </div>
//           )}
//           {activity.detailedAddress && (
//             <div className="flex items-center gap-1">
//               <MapPin className="h-4 w-4" />
//               <span className="truncate">{activity.detailedAddress}</span>
//             </div>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="pb-4">
//         <p className="text-gray-700 line-clamp-3 leading-relaxed">{activity.description}</p>

//         {/* Stats Row */}
//         <div className="mt-4 flex items-center justify-between">
//           {/* Show 0 correctly as well */}
//           {typeof activity.peopleHelped === "number" && (
//             <div className="flex items-center gap-2 text-emerald-600">
//               <div className="w-2 h-2 bg-emerald-500 rounded-full" />
//               <span className="text-sm font-semibold">{activity.peopleHelped} helped</span>
//             </div>
//           )}

//           {typeof activity.expenseAmount === "number" && (
//             <div className="flex items-center gap-2 text-amber-600">
//               <DollarSign className="h-4 w-4" />
//               <span className="text-sm font-semibold">
//                 {activity.expenseAmount.toLocaleString()}
//               </span>
//             </div>
//           )}
//         </div>
//       </CardContent>

//       {/* 3) Footer sticks to bottom via mt-auto */}
//       <CardFooter className="mt-auto flex justify-between items-center border-t border-gray-100 pt-5 bg-gray-50">
//         <Button
//           onClick={onView}
//           className={clsx(
//             "flex-1 font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg",
//             isAdmin
//               ? "bg-black text-white hover:bg-gray-900"
//               : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
//           )}
//         >
//           <Eye className="h-4 w-4 mr-2" />
//           View Details
//         </Button>

//         {isAdmin && (
//           <div className="flex gap-2 ml-3">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onEdit}
//               className="p-3 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 bg-transparent"
//             >
//               <Pencil className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onDelete}
//               disabled={isDeleting}
//               className="p-3 border-gray-200 hover:border-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 bg-transparent"
//             >
//               {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
//             </Button>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   )
// }

// export default ActivityCard








