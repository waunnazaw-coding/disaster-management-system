



// "use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useActivityStore } from "@/store/activityStore"
import { format } from "date-fns"
import { ArrowLeft, Badge, Building2, Calendar, ChevronLeft, ChevronRight, Heart, LucideCircleDollarSign, MapPin, Play, Share2, User, Users, X, ZoomIn } from "lucide-react"
import React from "react"
import { useNavigate, useParams } from "react-router-dom"

// import React from "react"
// // import { useParams, useNavigate } from "react-router-dom"
// import { useParams, useNavigate } from "react-router-dom"
// import { useActivityStore } from "@/store/activityStore"
// import { format } from "date-fns"
// import { Button } from "@/components/ui/button"
// import {
//   ArrowLeft,
//   Share2,
//   MapPin,
//   Users,
//   CalendarDays,
//   CircleDollarSign,
//   PlayCircle,
//   Clock,
//   Heart,
//   Building2,
//   User,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   ZoomIn,
// } from "lucide-react"
// import { Skeleton } from "@/components/ui/skeleton"

// const ActivityDetailPage: React.FC = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { currentActivity, fetchActivity, loading } = useActivityStore()
//   const activityId = Number.parseInt(id || "0", 10)

//   const [lightboxOpen, setLightboxOpen] = React.useState(false)
//   const [lightboxIndex, setLightboxIndex] = React.useState(0)

//   React.useEffect(() => {
//     if (activityId) fetchActivity(activityId)
//   }, [activityId, fetchActivity])

//   React.useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!lightboxOpen) return

//       if (e.key === "Escape") {
//         setLightboxOpen(false)
//       } else if (e.key === "ArrowLeft") {
//         setLightboxIndex((prev) => (prev > 0 ? prev - 1 : currentActivity!.media.length - 1))
//       } else if (e.key === "ArrowRight") {
//         setLightboxIndex((prev) => (prev < currentActivity!.media.length - 1 ? prev + 1 : 0))
//       }
//     }

//     document.addEventListener("keydown", handleKeyDown)
//     return () => document.removeEventListener("keydown", handleKeyDown)
//   }, [lightboxOpen, currentActivity])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <div className="max-w-6xl mx-auto">
//             <Skeleton className="h-12 w-48 mb-8" />
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2 space-y-8">
//                 <Skeleton className="h-96 w-full rounded-3xl" />
//                 <Skeleton className="h-8 w-full" />
//                 <Skeleton className="h-6 w-3/4" />
//                 <div className="grid grid-cols-3 gap-4">
//                   <Skeleton className="h-24 w-full rounded-2xl" />
//                   <Skeleton className="h-24 w-full rounded-2xl" />
//                   <Skeleton className="h-24 w-full rounded-2xl" />
//                 </div>
//               </div>
//               <div className="space-y-6">
//                 <Skeleton className="h-64 w-full rounded-3xl" />
//                 <Skeleton className="h-12 w-full rounded-2xl" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!currentActivity) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-4">
//           <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//             <Heart className="h-12 w-12 text-gray-400" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Activity not found</h2>
//           <p className="text-gray-600 mb-8 leading-relaxed">
//             The activity you're looking for doesn't exist or has been removed.
//           </p>
//           <Button
//             onClick={() => navigate("/activities")}
//             className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-2xl font-medium"
//           >
//             Browse All Activities
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const openLightboxAt = (index: number) => {
//     setLightboxIndex(index)
//     setLightboxOpen(true)
//   }

//   const closeLightbox = () => {
//     setLightboxOpen(false)
//   }

//   const nextImage = () => {
//     setLightboxIndex((prev) => (prev < currentActivity.media.length - 1 ? prev + 1 : 0))
//   }

//   const prevImage = () => {
//     setLightboxIndex((prev) => (prev > 0 ? prev - 1 : currentActivity.media.length - 1))
//   }

//   const hero = currentActivity.media[0]?.filePath

//   const onShare = async () => {
//     const url = window.location.href
//     const text = currentActivity.title
//     try {
//       if (navigator.share) {
//         await navigator.share({ title: text, text, url })
//       } else {
//         await navigator.clipboard.writeText(url)
//         alert("Link copied to clipboard")
//       }
//     } catch {}
//   }

//   const activityTypeColors: Record<string, string> = {
//     Rescue: "from-red-500 to-red-600",
//     Donation: "from-emerald-500 to-emerald-600",
//     Support: "from-red-400 to-red-500",
//     default: "from-gray-500 to-gray-600",
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
//       {lightboxOpen && (
//         <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
//           <div className="absolute inset-0 flex items-center justify-center p-4">
//             {/* Close Button */}
//             <button
//               onClick={closeLightbox}
//               className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
//             >
//               <X className="h-6 w-6" />
//             </button>

//             {/* Navigation Buttons */}
//             {currentActivity.media.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
//                 >
//                   <ChevronLeft className="h-6 w-6" />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
//                 >
//                   <ChevronRight className="h-6 w-6" />
//                 </button>
//               </>
//             )}

//             {/* Image Counter */}
//             {currentActivity.media.length > 1 && (
//               <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
//                 {lightboxIndex + 1} / {currentActivity.media.length}
//               </div>
//             )}

//             {/* Main Image/Video */}
//             <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
//               {currentActivity.media[lightboxIndex]?.isVideo ? (
//                 <video
//                   src={currentActivity.media[lightboxIndex]?.filePath}
//                   className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
//                   controls
//                   autoPlay
//                 />
//               ) : (
//                 <img
//                   src={currentActivity.media[lightboxIndex]?.filePath || "/placeholder.svg"}
//                   alt={`Media ${lightboxIndex + 1}`}
//                   className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
//                 />
//               )}
//             </div>

//             {/* Image Info */}
//             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-2xl text-center">
//               <h3 className="text-white text-xl font-semibold mb-2">{currentActivity.title}</h3>
//               <p className="text-white/80 text-sm">{currentActivity.reliefTeamName}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 py-12">
//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           className="mb-8 text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded-2xl px-6 py-3 font-medium transition-all duration-200"
//           onClick={() => navigate(-1)}
//         >
//           <ArrowLeft className="h-5 w-5 mr-2" /> Back to Activities
//         </Button>

//         <div className="max-w-6xl mx-auto">
//           {/* Hero Section */}
//           <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-12 group">
//             <div className="relative h-[500px] w-full">
//               {hero ? (
//                 <img
//                   src={hero || "/placeholder.svg"}
//                   alt={currentActivity.title}
//                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               ) : (
//                 <div
//                   className={`h-full w-full bg-gradient-to-br ${
//                     activityTypeColors[currentActivity.activityType] || activityTypeColors.default
//                   }`}
//                 />
//               )}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

//               {/* Hero Content */}
//               <div className="absolute bottom-0 left-0 right-0 p-10">
//                 <div className="flex items-end justify-between">
//                   <div className="text-white max-w-4xl">
//                     <div className="mb-6 flex items-center gap-4">
//                       <span
//                         className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${
//                           activityTypeColors[currentActivity.activityType] || activityTypeColors.default
//                         } px-6 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-sm`}
//                       >
//                         {currentActivity.activityType}
//                       </span>
//                       <div className="flex items-center gap-2 text-white/90 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
//                         <Clock className="h-4 w-4" />
//                         <span className="text-sm font-medium">
//                           {format(new Date(currentActivity.activityDate), "MMMM d, yyyy")}
//                         </span>
//                       </div>
//                     </div>
//                     <h1 className="text-5xl font-bold mb-4 leading-tight drop-shadow-lg">{currentActivity.title}</h1>
//                     {currentActivity.reliefTeamName && (
//                       <p className="text-xl text-white/90 font-medium drop-shadow-md">
//                         {currentActivity.reliefTeamName}
//                       </p>
//                     )}
//                   </div>
//                   <Button
//                     onClick={onShare}
//                     className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-2xl px-6 py-3 transition-all duration-200 shadow-lg"
//                   >
//                     <Share2 className="h-5 w-5 mr-2" /> Share
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//             {/* Main Content */}
//             <div className="lg:col-span-2 space-y-10">
//               {/* Description */}
//               <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Activity</h2>
//                 <p className="text-gray-700 text-lg leading-relaxed">{currentActivity.description}</p>
//               </div>

//               {/* Media Gallery */}
//               {currentActivity.media.length > 0 && (
//                 <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-bold text-gray-900">Activity Gallery</h3>
//                     <div className="flex items-center gap-2 text-gray-500">
//                       <ZoomIn className="h-5 w-5" />
//                       <span className="text-sm font-medium">Click to view full size</span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {currentActivity.media.map((m, idx) => (
//                       <button
//                         key={m.id}
//                         className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
//                         onClick={() => openLightboxAt(idx)}
//                         aria-label={`Open media ${idx + 1}`}
//                       >
//                         {m.isVideo ? (
//                           <>
//                             <video
//                               src={m.filePath}
//                               className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
//                               muted
//                               playsInline
//                               preload="metadata"
//                             />
//                             <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-all duration-300 group-hover:bg-black/60">
//                               <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transition-transform duration-300 group-hover:scale-110">
//                                 <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
//                               </div>
//                             </div>
//                             <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
//                               VIDEO
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <img
//                               src={m.filePath || "/placeholder.svg"}
//                               alt={`Media ${m.id}`}
//                               className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
//                               loading="lazy"
//                             />
//                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
//                               <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
//                                 <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
//                               </div>
//                             </div>
//                           </>
//                         )}

//                         {/* Image counter overlay */}
//                         <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
//                           {idx + 1} / {currentActivity.media.length}
//                         </div>
//                       </button>
//                     ))}
//                   </div>

//                   {/* Gallery info */}
//                   <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
//                     <p className="text-sm text-gray-600 text-center">
//                       <strong>{currentActivity.media.length}</strong> media files • Use arrow keys to navigate • Press
//                       ESC to close
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-8">
//               {/* Key Stats */}
//               <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Activity Details</h3>

//                 {[
//                   {
//                     icon: CalendarDays,
//                     title: "Date",
//                     value: format(new Date(currentActivity.activityDate), "MMMM d, yyyy"),
//                     bg: "bg-red-100",
//                     color: "text-red-600",
//                   },
//                   {
//                     icon: Building2,
//                     title: "Relief Team",
//                     value: currentActivity.reliefTeamName,
//                     bg: "bg-red-100",
//                     color: "text-red-600",
//                   },
//                   {
//                     icon: User,
//                     title: "Posted By",
//                     value: currentActivity.postedByUserName,
//                     bg: "bg-red-100",
//                     color: "text-red-600",
//                   },
//                   {
//                     icon: MapPin,
//                     title: "Location",
//                     value: currentActivity.detailedAddress,
//                     bg: "bg-emerald-100",
//                     color: "text-emerald-600",
//                   },
//                   {
//                     icon: Users,
//                     title: "People Helped",
//                     value:
//                       typeof currentActivity.peopleHelped === "number"
//                         ? `${currentActivity.peopleHelped.toLocaleString()} individuals`
//                         : null,
//                     bg: "bg-purple-100",
//                     color: "text-purple-600",
//                   },
//                   {
//                     icon: CircleDollarSign,
//                     title: "Resources",
//                     value:
//                       typeof currentActivity.expenseAmount === "number"
//                         ? `$${currentActivity.expenseAmount.toLocaleString()} invested`
//                         : null,
//                     bg: "bg-amber-100",
//                     color: "text-amber-600",
//                   },
//                 ].map(
//                   (item, idx) =>
//                     item.value && (
//                       <div
//                         className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
//                         key={idx}
//                       >
//                         <div
//                           className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}
//                         >
//                           <item.icon className={`h-7 w-7 ${item.color}`} />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900 mb-1 text-lg">{item.title}</h4>
//                           <p className="text-gray-600">{item.value}</p>
//                         </div>
//                       </div>
//                     ),
//                 )}
//               </div>

//               {/* CTA */}
//               <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-3xl p-8 text-white shadow-xl">
//                 <h3 className="text-2xl font-bold mb-4">Get Involved</h3>
//                 <p className="text-red-100 mb-6 leading-relaxed">
//                   Want to support similar relief activities? Join our community and make a difference.
//                 </p>
//                 <Button
//                   className="w-full bg-white text-red-600 hover:bg-red-50 font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//                   onClick={() => navigate("/get-involved")}
//                 >
//                   Learn More
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ActivityDetailPage

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentActivity, fetchActivity, loading } = useActivityStore()
  const activityId = Number.parseInt(id || "0", 10)

  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxIndex, setLightboxIndex] = React.useState(0)

  React.useEffect(() => {
    if (activityId) fetchActivity(activityId)
  }, [activityId, fetchActivity])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return

      if (e.key === "Escape") {
        setLightboxOpen(false)
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : currentActivity!.media.length - 1))
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < currentActivity!.media.length - 1 ? prev + 1 : 0))
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, currentActivity])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-80 w-full rounded-3xl" />
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
    )
  }

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Activity not found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The activity you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/activities")}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-medium"
          >
            Browse All Activities
          </Button>
        </div>
      </div>
    )
  }

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev < currentActivity.media.length - 1 ? prev + 1 : 0))
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : currentActivity.media.length - 1))
  }

  const hero = currentActivity.media[0]?.filePath

  const onShare = async () => {
    const url = window.location.href
    const text = currentActivity.title
    try {
      if (navigator.share) {
        await navigator.share({ title: text, text, url })
      } else {
        await navigator.clipboard.writeText(url)
        alert("Link copied to clipboard")
      }
    } catch {}
  }

  const activityTypeColors: Record<string, string> = {
    Rescue: "bg-red-100 text-red-800",
    Donation: "bg-emerald-100 text-emerald-800",
    Support: "bg-amber-100 text-amber-800",
    default: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-2 font-medium"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Activities
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="rounded-3xl overflow-hidden shadow-xl mb-8 relative group">
            <div className="relative h-72 md:h-80 w-full">
              {hero ? (
                <img
                  src={hero || "/placeholder.svg"}
                  alt={currentActivity.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-red-600 to-red-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className={activityTypeColors[currentActivity.activityType] || activityTypeColors.default}>
                    {currentActivity.activityType}
                  </Badge>
                  <div className="flex items-center text-white/90">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {format(new Date(currentActivity.activityDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{currentActivity.title}</h1>
                
                {currentActivity.reliefTeamName && (
                  <div className="flex items-center text-white/90">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="text-lg">{currentActivity.reliefTeamName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <Card className="rounded-2xl shadow-md border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Activity</h2>
                  <p className="text-gray-700 leading-relaxed">{currentActivity.description}</p>
                </CardContent>
              </Card>

              {/* Media Gallery */}
              {currentActivity.media.length > 0 && (
                <Card className="rounded-2xl shadow-md border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Activity Gallery</h3>
                      <div className="flex items-center gap-2 text-gray-500">
                        <ZoomIn className="h-4 w-4" />
                        <span className="text-sm">Click to view full size</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentActivity.media.map((m, idx) => (
                        <div
                          key={m.id}
                          className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                          onClick={() => openLightboxAt(idx)}
                        >
                          {m.isVideo ? (
                            <>
                              <video
                                src={m.filePath}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                muted
                                playsInline
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                  <Play className="h-6 w-6 text-white fill-current" />
                                </div>
                              </div>
                              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                                VIDEO
                              </div>
                            </>
                          ) : (
                            <>
                              <img
                                src={m.filePath || "/placeholder.svg"}
                                alt={`Media ${m.id}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                                  <ZoomIn className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </>
                          )}
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                            {idx + 1} / {currentActivity.media.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Details Card */}
              <Card className="rounded-2xl shadow-md border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Details</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-lg mr-4">
                        <Calendar className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {format(new Date(currentActivity.activityDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    
                    {currentActivity.reliefTeamName && (
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-lg mr-4">
                          <Building2 className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Relief Team</p>
                          <p className="font-medium">{currentActivity.reliefTeamName}</p>
                        </div>
                      </div>
                    )}
                    
                    {currentActivity.postedByUserName && (
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-lg mr-4">
                          <User className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Posted By</p>
                          <p className="font-medium">{currentActivity.postedByUserName}</p>
                        </div>
                      </div>
                    )}
                    
                    {currentActivity.detailedAddress && (
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-lg mr-4">
                          <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{currentActivity.detailedAddress}</p>
                        </div>
                      </div>
                    )}
                    
                    {typeof currentActivity.peopleHelped === "number" && (
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-lg mr-4">
                          <Users className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">People Helped</p>
                          <p className="font-medium">{currentActivity.peopleHelped.toLocaleString()} individuals</p>
                        </div>
                      </div>
                    )}
                    
                    {typeof currentActivity.expenseAmount === "number" && (
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-lg mr-4">
                          <LucideCircleDollarSign className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Resources</p>
                          <p className="font-medium">${currentActivity.expenseAmount.toLocaleString()} invested</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Card */}
              <Card className="rounded-2xl shadow-md border-0">
                <CardContent className="p-6">
                  <Button 
                    onClick={onShare}
                    variant="outline" 
                    className="w-full mb-4 border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share Activity
                  </Button>
                  {/* <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Support This Cause
                  </Button> */}
                </CardContent>
              </Card>

              {/* CTA Card */}
              {/* <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-red-600 to-red-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Get Involved</h3>
                  <p className="text-red-100 mb-6">
                    Want to support similar relief activities? Join our community and make a difference.
                  </p>
                  <Button className="w-full bg-white text-red-600 hover:bg-red-50 font-medium py-3 rounded-xl">
                    Learn More
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>

          {currentActivity.media.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="relative max-w-4xl w-full max-h-full flex items-center justify-center">
            {currentActivity.media[lightboxIndex]?.isVideo ? (
              <video
                src={currentActivity.media[lightboxIndex]?.filePath}
                className="max-w-full max-h-full object-contain rounded-lg"
                controls
                autoPlay
              />
            ) : (
              <img
                src={currentActivity.media[lightboxIndex]?.filePath || "/placeholder.svg"}
                alt={`Media ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-2xl text-center">
            <h3 className="text-white text-lg font-semibold mb-2">{currentActivity.title}</h3>
            <p className="text-white/80 text-sm">{currentActivity.reliefTeamName}</p>
          </div>

          <div className="absolute bottom-6 right-6 text-white text-sm">
            {lightboxIndex + 1} / {currentActivity.media.length}
          </div>
        </div>
      )}
    </div>
  )
}

export {  ActivityDetailPage }