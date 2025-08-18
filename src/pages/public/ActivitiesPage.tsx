// // import type React from "react"
// // import { useEffect, useState } from "react"
// // import { useNavigate } from "react-router-dom"
// // import { useActivityStore } from "@/store/activityStore"
// // import ActivityCard from "@/components/activity/ActivityCard"
// // import { Input } from "@/components/ui/input"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { ACTIVITY_TYPES } from "@/types/activity"
// // import { Button } from "@/components/ui/button"
// // import { Loader2, Search, Filter, RefreshCw, ChevronDown } from "lucide-react"

// // const ITEMS_PER_PAGE = 9

// // const ActivitiesPage: React.FC = () => {
// //   const { 
// //     activities, 
// //     loading, 
// //     reliefTeams,
// //     fetchActivities,
// //     fetchReliefTeams 
// //   } = useActivityStore()
  
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [filterType, setFilterType] = useState<string>("all")
// //   const [reliefTeamFilter, setReliefTeamFilter] = useState<string>("all") // New state
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [isLoadingMore, setIsLoadingMore] = useState(false)
// //   const navigate = useNavigate()

// //   useEffect(() => {
// //     fetchActivities()
// //     fetchReliefTeams() // Fetch relief teams
// //   }, [fetchActivities, fetchReliefTeams])

// //   // Filter activities
// //   const filteredActivities = activities.filter((activity) => {
// //     const q = searchTerm.trim().toLowerCase()
// //     const matchesSearch =
// //       !q ||
// //       activity.title.toLowerCase().includes(q) ||
// //       activity.description.toLowerCase().includes(q) ||
// //       activity.reliefTeamName?.toLowerCase().includes(q)
      
// //     const matchesType = filterType === "all" 
// //       ? true 
// //       : activity.activityType === filterType
      
// //     // New relief team filter
// //     const matchesTeam = reliefTeamFilter === "all" 
// //       ? true 
// //       : activity.reliefTeamId === parseInt(reliefTeamFilter)
      
// //     return matchesSearch && matchesType && matchesTeam
// //   })

// //   // Pagination logic
// //   const totalItems = filteredActivities.length
// //   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
// //   const displayedActivities = filteredActivities.slice(0, currentPage * ITEMS_PER_PAGE)
// //   const hasMore = currentPage < totalPages

// //   const handleLoadMore = () => {
// //     setIsLoadingMore(true)
// //     setTimeout(() => {
// //       setCurrentPage((prev) => prev + 1)
// //       setIsLoadingMore(false)
// //     }, 500)
// //   }

// //   const handleFilterChange = () => {
// //     setCurrentPage(1)
// //   }

// //   const clearFilters = () => {
// //     setSearchTerm("")
// //     setFilterType("all")
// //     setReliefTeamFilter("all") // Reset team filter
// //     setCurrentPage(1)
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
// //       {/* Hero Section */}
// //       <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
// //         <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-10"></div>
// //         <div className="relative container mx-auto px-4 py-16 text-center">
// //           <div className="mx-auto max-w-4xl">
// //             <h1 className="text-5xl font-bold tracking-tight text-white mb-6">Relief Activities</h1>
// //             <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
// //               Discover ongoing and past relief activities across different disaster zones. See how dedicated teams are
// //               making a real difference in affected communities worldwide.
// //             </p>
// //             <div className="mt-8 flex items-center justify-center gap-8 text-blue-200">
// //               <div className="text-center">
// //                 <div className="text-2xl font-bold text-white">{activities.length}</div>
// //                 <div className="text-sm">Total Activities</div>
// //               </div>
// //               <div className="h-8 w-px bg-blue-400/30"></div>
// //               <div className="text-center">
// //                 <div className="text-2xl font-bold text-white">{ACTIVITY_TYPES.length}</div>
// //                 <div className="text-sm">Activity Types</div>
// //               </div>
// //               <div className="h-8 w-px bg-blue-400/30"></div>
// //               <div className="text-center">
// //                 <div className="text-2xl font-bold text-white">{reliefTeams.length}</div>
// //                 <div className="text-sm">Relief Teams</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="container mx-auto px-4 py-12">
// //         {/* Enhanced Filters Section - Made full width */}
// //         <div className="mb-12">
// //           <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 p-6 md:p-8">
// //             {/* Filter Grid - Fixed height classes */}
// //             <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
// //               {/* Search Input */}
// //               <div className="md:col-span-2 relative flex">
// //                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// //                   <Search className="h-5 w-5 text-gray-400" />
// //                 </div>
// //                 <Input
// //                   placeholder="Search activities, teams, locations..."
// //                   value={searchTerm}
// //                   onChange={(e) => {
// //                     setSearchTerm(e.target.value)
// //                     handleFilterChange()
// //                   }}
// //                   className="pl-12 h-14 text-base md:text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl"
// //                 />
// //               </div>

// // {/* Activity Type Filter */}
// // <div className="relative flex items-center">
// //   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// //     <Filter className="h-5 w-5 text-gray-400" />
// //   </div>
// //   <Select
// //     value={filterType}
// //     onValueChange={(value) => {
// //       setFilterType(value);
// //       handleFilterChange();
// //     }}
// //   >
// //     <SelectTrigger 
// //       className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-blue-500 text-left truncate pl-12 !min-h-0"
// //     >
// //       <SelectValue placeholder="All Types" />
// //     </SelectTrigger>
// //     <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
// //       <SelectItem value="all" className="text-base md:text-lg py-3">
// //         All Activity Types
// //       </SelectItem>
// //       {ACTIVITY_TYPES.map((type) => (
// //         <SelectItem key={type} value={type} className="text-base md:text-lg py-3">
// //           {type}
// //         </SelectItem>
// //       ))}
// //     </SelectContent>
// //   </Select>
// // </div>

// // {/* Relief Team Filter */}
// // <div className="relative flex items-center">
// //   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// //     <Filter className="h-5 w-5 text-gray-400" />
// //   </div>
// //   <Select
// //     value={reliefTeamFilter}
// //     onValueChange={(value) => {
// //       setReliefTeamFilter(value);
// //       handleFilterChange();
// //     }}
// //   >
// //     <SelectTrigger 
// //       className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-blue-500 text-left truncate pl-12 !min-h-0"
// //     >
// //       <SelectValue placeholder="All Teams" className="truncate max-w-[80%]" />
// //     </SelectTrigger>
// //     <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
// //       <SelectItem value="all" className="text-base md:text-lg py-3">
// //         All Relief Teams
// //       </SelectItem>
// //       {reliefTeams.map((team) => (
// //         <SelectItem 
// //           key={team.id} 
// //           value={team.id.toString()} 
// //           className="text-base md:text-lg py-3 truncate"
// //         >
// //           {team.name}
// //         </SelectItem>
// //       ))}
// //     </SelectContent>
// //   </Select>
// // </div>

// // {/* Clear Filters Button */}
// // <Button
// //   variant="outline"
// //   className="h-14 rounded-2xl text-base md:text-lg font-medium border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 bg-transparent flex items-center justify-center"
// //   onClick={clearFilters}
// // >
// //   <RefreshCw className="h-5 w-5 mr-2 flex-shrink-0" />
// //   <span className="truncate">Clear</span>
// // </Button>
// // </div>

// //             {/* Filter Summary - Improved wrapping */}
// //             {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all") && (
// //               <div className="mt-6 pt-6 border-t border-gray-100">
// //                 <div className="flex flex-wrap items-center gap-2">
// //                   <span className="text-sm text-gray-600">
// //                     Showing {displayedActivities.length} of {totalItems} activities
// //                   </span>
                  
// //                   {searchTerm && (
// //                     <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">
// //                       Search: "{searchTerm}"
// //                     </span>
// //                   )}
                  
// //                   {filterType !== "all" && (
// //                     <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm whitespace-nowrap">
// //                       Type: {filterType}
// //                     </span>
// //                   )}
                  
// //                   {reliefTeamFilter !== "all" && (
// //                     <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm whitespace-nowrap truncate max-w-[200px]">
// //                       Team: {
// //                         reliefTeams.find(t => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"
// //                       }
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Activities Grid */}
// //         {loading ? (
// //           <div className="flex justify-center py-20">
// //             <div className="text-center">
// //               <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
// //               <p className="text-gray-600 text-lg">Loading activities...</p>
// //             </div>
// //           </div>
// //         ) : filteredActivities.length === 0 ? (
// //           <div className="text-center py-20">
// //             <div className="mx-auto max-w-md">
// //               <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
// //                 <Search className="h-12 w-12 text-gray-400" />
// //               </div>
// //               <h3 className="text-2xl font-semibold text-gray-800 mb-3">No activities found</h3>
// //               <p className="text-gray-600 mb-8 leading-relaxed">
// //                 We couldn't find any activities matching your search criteria. Try adjusting your filters or search
// //                 terms.
// //               </p>
// //               <Button
// //                 onClick={clearFilters}
// //                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200"
// //               >
// //                 View All Activities
// //               </Button>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Activities Grid */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
// //               {displayedActivities.map((activity, index) => (
// //                 <div
// //                   key={activity.id}
// //                   className="animate-in fade-in slide-in-from-bottom-4 duration-500"
// //                   style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
// //                 >
// //                   <ActivityCard activity={activity} onView={() => navigate(`/activities/${activity.id}`)} />
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Load More Section */}
// //             {hasMore && (
// //               <div className="text-center">
// //                 <div className="mb-6">
// //                   <div className="text-sm text-gray-500 mb-2">
// //                     Showing {displayedActivities.length} of {totalItems} activities
// //                   </div>
// //                   <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
// //                     <div
// //                       className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
// //                       style={{ width: `${(displayedActivities.length / totalItems) * 100}%` }}
// //                     ></div>
// //                   </div>
// //                 </div>
// //                 <Button
// //                   onClick={handleLoadMore}
// //                   disabled={isLoadingMore}
// //                   className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
// //                 >
// //                   {isLoadingMore ? (
// //                     <>
// //                       <Loader2 className="h-5 w-5 animate-spin mr-2" />
// //                       Loading more...
// //                     </>
// //                   ) : (
// //                     <>
// //                       Load More Activities
// //                       <ChevronDown className="h-5 w-5 ml-2" />
// //                     </>
// //                   )}
// //                 </Button>
// //               </div>
// //             )}

// //             {/* End of Results */}
// //             {!hasMore && totalItems > ITEMS_PER_PAGE && (
// //               <div className="text-center py-8">
// //                 <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-gray-600">
// //                   <span className="text-sm font-medium">You've seen all {totalItems} activities</span>
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default ActivitiesPage


// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useActivityStore } from "@/store/activityStore"
// import ActivityCard from "@/components/activity/ActivityCard"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ACTIVITY_TYPES } from "@/types/activity"
// import { Button } from "@/components/ui/button"
// import { Loader2, Search, Filter, RefreshCw, ChevronDown } from "lucide-react"

// const ITEMS_PER_PAGE = 9

// const ActivitiesPage: React.FC = () => {
//   const { activities, loading, reliefTeams, fetchActivities, fetchReliefTeams } = useActivityStore()

//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterType, setFilterType] = useState<string>("all")
//   const [reliefTeamFilter, setReliefTeamFilter] = useState<string>("all")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isLoadingMore, setIsLoadingMore] = useState(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     fetchActivities()
//     fetchReliefTeams()
//   }, [fetchActivities, fetchReliefTeams])

//   const filteredActivities = activities.filter((activity) => {
//     const q = searchTerm.trim().toLowerCase()
//     const matchesSearch =
//       !q ||
//       activity.title.toLowerCase().includes(q) ||
//       activity.description.toLowerCase().includes(q) ||
//       activity.reliefTeamName?.toLowerCase().includes(q)

//     const matchesType = filterType === "all" ? true : activity.activityType === filterType
//     const matchesTeam = reliefTeamFilter === "all" ? true : activity.reliefTeamId === Number.parseInt(reliefTeamFilter)

//     return matchesSearch && matchesType && matchesTeam
//   })

//   const totalItems = filteredActivities.length
//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
//   const displayedActivities = filteredActivities.slice(0, currentPage * ITEMS_PER_PAGE)
//   const hasMore = currentPage < totalPages

//   const handleLoadMore = () => {
//     setIsLoadingMore(true)
//     setTimeout(() => {
//       setCurrentPage((prev) => prev + 1)
//       setIsLoadingMore(false)
//     }, 500)
//   }

//   const handleFilterChange = () => {
//     setCurrentPage(1)
//   }

//   const clearFilters = () => {
//     setSearchTerm("")
//     setFilterType("all")
//     setReliefTeamFilter("all")
//     setCurrentPage(1)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
//       <div className="relative overflow-hidden bg-gradient-to-r from-red-900 via-red-800 to-red-700">
//         <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-10"></div>
//         <div className="relative container mx-auto px-4 py-16 text-center">
//           <div className="mx-auto max-w-4xl">
//             <h1 className="text-5xl font-bold tracking-tight text-white mb-6">Relief Activities</h1>
//             <p className="text-xl text-red-100 leading-relaxed max-w-3xl mx-auto">
//               Discover ongoing and past relief activities across different disaster zones. See how dedicated teams are
//               making a real difference in affected communities worldwide.
//             </p>
//             <div className="mt-8 flex items-center justify-center gap-8 text-red-200">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white">{activities.length}</div>
//                 <div className="text-sm">Total Activities</div>
//               </div>
//               <div className="h-8 w-px bg-red-400/30"></div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white">{ACTIVITY_TYPES.length}</div>
//                 <div className="text-sm">Activity Types</div>
//               </div>
//               <div className="h-8 w-px bg-red-400/30"></div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-white">{reliefTeams.length}</div>
//                 <div className="text-sm">Relief Teams</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12">
//         {/* Enhanced Filters Section */}
//         <div className="mb-12">
//           <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 p-6 md:p-8">
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
//               {/* Search Input */}
//               <div className="md:col-span-2 relative flex">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   placeholder="Search activities, teams, locations..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value)
//                     handleFilterChange()
//                   }}
//                   className="pl-12 h-14 text-base md:text-lg border-gray-200 focus:border-red-500 focus:ring-red-500/20 rounded-2xl"
//                 />
//               </div>

//               <div className="relative flex items-center">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Filter className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Select
//                   value={filterType}
//                   onValueChange={(value) => {
//                     setFilterType(value)
//                     handleFilterChange()
//                   }}
//                 >
//                   <SelectTrigger className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-red-500 text-left truncate pl-12 !min-h-0">
//                     <SelectValue placeholder="All Types" />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
//                     <SelectItem value="all" className="text-base md:text-lg py-3">
//                       All Activity Types
//                     </SelectItem>
//                     {ACTIVITY_TYPES.map((type) => (
//                       <SelectItem key={type} value={type} className="text-base md:text-lg py-3">
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="relative flex items-center">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Filter className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Select
//                   value={reliefTeamFilter}
//                   onValueChange={(value) => {
//                     setReliefTeamFilter(value)
//                     handleFilterChange()
//                   }}
//                 >
//                   <SelectTrigger className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-red-500 text-left truncate pl-12 !min-h-0">
//                     <SelectValue placeholder="All Teams" className="truncate max-w-[80%]" />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
//                     <SelectItem value="all" className="text-base md:text-lg py-3">
//                       All Relief Teams
//                     </SelectItem>
//                     {reliefTeams.map((team) => (
//                       <SelectItem
//                         key={team.id}
//                         value={team.id.toString()}
//                         className="text-base md:text-lg py-3 truncate"
//                       >
//                         {team.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Button
//                 variant="outline"
//                 className="h-14 rounded-2xl text-base md:text-lg font-medium border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 bg-transparent flex items-center justify-center"
//                 onClick={clearFilters}
//               >
//                 <RefreshCw className="h-5 w-5 mr-2 flex-shrink-0" />
//                 <span className="truncate">Clear</span>
//               </Button>
//             </div>

//             {/* Filter Summary */}
//             {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all") && (
//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span className="text-sm text-gray-600">
//                     Showing {displayedActivities.length} of {totalItems} activities
//                   </span>

//                   {searchTerm && (
//                     <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm whitespace-nowrap">
//                       Search: "{searchTerm}"
//                     </span>
//                   )}

//                   {filterType !== "all" && (
//                     <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm whitespace-nowrap">
//                       Type: {filterType}
//                     </span>
//                   )}

//                   {reliefTeamFilter !== "all" && (
//                     <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm whitespace-nowrap truncate max-w-[200px]">
//                       Team: {reliefTeams.find((t) => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Activities Grid */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <div className="text-center">
//               <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto mb-4" />
//               <p className="text-gray-600 text-lg">Loading activities...</p>
//             </div>
//           </div>
//         ) : filteredActivities.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="mx-auto max-w-md">
//               <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                 <Search className="h-12 w-12 text-gray-400" />
//               </div>
//               <h3 className="text-2xl font-semibold text-gray-800 mb-3">No activities found</h3>
//               <p className="text-gray-600 mb-8 leading-relaxed">
//                 We couldn't find any activities matching your search criteria. Try adjusting your filters or search
//                 terms.
//               </p>
//               <Button
//                 onClick={clearFilters}
//                 className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200"
//               >
//                 View All Activities
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 auto-rows-fr">
//               {displayedActivities.map((activity, index) => (
//                 <div
//                   key={activity.id}
//                   className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full"
//                   style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
//                 >
//                   <ActivityCard activity={activity} onView={() => navigate(`/activities/${activity.id}`)} />
//                 </div>
//               ))}
//             </div>

//             {hasMore && (
//               <div className="text-center">
//                 <div className="mb-6">
//                   <div className="text-sm text-gray-500 mb-2">
//                     Showing {displayedActivities.length} of {totalItems} activities
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
//                     <div
//                       className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${(displayedActivities.length / totalItems) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={handleLoadMore}
//                   disabled={isLoadingMore}
//                   className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
//                 >
//                   {isLoadingMore ? (
//                     <>
//                       <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                       Loading more...
//                     </>
//                   ) : (
//                     <>
//                       Load More Activities
//                       <ChevronDown className="h-5 w-5 ml-2" />
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}

//             {!hasMore && totalItems > ITEMS_PER_PAGE && (
//               <div className="text-center py-8">
//                 <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-gray-600">
//                   <span className="text-sm font-medium">You've seen all {totalItems} activities</span>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ActivitiesPage


"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useActivityStore } from "@/store/activityStore"
import ActivityCard from "@/components/activity/ActivityCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ACTIVITY_TYPES } from "@/types/activity"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Filter, RefreshCw, ChevronDown } from "lucide-react"

const ITEMS_PER_PAGE = 9

const ActivitiesPage: React.FC = () => {
  const { activities, loading, reliefTeams, fetchActivities, fetchReliefTeams } = useActivityStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [reliefTeamFilter, setReliefTeamFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchActivities()
    fetchReliefTeams()
  }, [fetchActivities, fetchReliefTeams])

  const filteredActivities = activities.filter((activity) => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !q ||
      activity.title.toLowerCase().includes(q) ||
      activity.description.toLowerCase().includes(q) ||
      activity.reliefTeamName?.toLowerCase().includes(q)

    const matchesType = filterType === "all" ? true : activity.activityType === filterType
    const matchesTeam = reliefTeamFilter === "all" ? true : activity.reliefTeamId === Number.parseInt(reliefTeamFilter)

    return matchesSearch && matchesType && matchesTeam
  })

  const totalItems = filteredActivities.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const displayedActivities = filteredActivities.slice(0, currentPage * ITEMS_PER_PAGE)
  const hasMore = currentPage < totalPages

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1)
      setIsLoadingMore(false)
    }, 500)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setReliefTeamFilter("all")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
      <div className="relative overflow-hidden bg-gradient-to-r from-red-900 via-red-800 to-red-700">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6">Relief Activities</h1>
            <p className="text-xl text-red-100 leading-relaxed max-w-3xl mx-auto">
              Discover ongoing and past relief activities across different disaster zones. See how dedicated teams are
              making a real difference in affected communities worldwide.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-red-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{activities.length}</div>
                <div className="text-sm">Total Activities</div>
              </div>
              <div className="h-8 w-px bg-red-400/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{ACTIVITY_TYPES.length}</div>
                <div className="text-sm">Activity Types</div>
              </div>
              <div className="h-8 w-px bg-red-400/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{reliefTeams.length}</div>
                <div className="text-sm">Relief Teams</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Enhanced Filters Section */}
        <div className="mb-12">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
              {/* Search Input */}
              <div className="md:col-span-2 relative flex">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Search activities, teams, locations..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleFilterChange()
                  }}
                  className="pl-12 h-14 text-base md:text-lg border-gray-200 focus:border-red-500 focus:ring-red-500/20 rounded-2xl"
                />
              </div>

              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <Select
                  value={filterType}
                  onValueChange={(value) => {
                    setFilterType(value)
                    handleFilterChange()
                  }}
                >
                  <SelectTrigger className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-red-500 text-left truncate pl-12 !min-h-0">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
                    <SelectItem value="all" className="text-base md:text-lg py-3">
                      All Activity Types
                    </SelectItem>
                    {ACTIVITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-base md:text-lg py-3">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <Select
                  value={reliefTeamFilter}
                  onValueChange={(value) => {
                    setReliefTeamFilter(value)
                    handleFilterChange()
                  }}
                >
                  <SelectTrigger className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-red-500 text-left truncate pl-12 !min-h-0">
                    <SelectValue placeholder="All Teams" className="truncate max-w-[80%]" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
                    <SelectItem value="all" className="text-base md:text-lg py-3">
                      All Relief Teams
                    </SelectItem>
                    {reliefTeams.map((team) => (
                      <SelectItem
                        key={team.id}
                        value={team.id.toString()}
                        className="text-base md:text-lg py-3 truncate"
                      >
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="h-14 rounded-2xl text-base md:text-lg font-medium border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 bg-transparent flex items-center justify-center"
                onClick={clearFilters}
              >
                <RefreshCw className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Clear</span>
              </Button>
            </div>

            {/* Filter Summary */}
            {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all") && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Showing {displayedActivities.length} of {totalItems} activities
                  </span>

                  {searchTerm && (
                    <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm whitespace-nowrap">
                      Search: "{searchTerm}"
                    </span>
                  )}

                  {filterType !== "all" && (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm whitespace-nowrap">
                      Type: {filterType}
                    </span>
                  )}

                  {reliefTeamFilter !== "all" && (
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm whitespace-nowrap truncate max-w-[200px]">
                      Team: {reliefTeams.find((t) => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading activities...</p>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No activities found</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any activities matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200"
              >
                View All Activities
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 auto-rows-fr">
              {displayedActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full"
                  style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
                >
                  <ActivityCard activity={activity} onView={() => navigate(`/activities/${activity.id}`)} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">
                    Showing {displayedActivities.length} of {totalItems} activities
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(displayedActivities.length / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading more...
                    </>
                  ) : (
                    <>
                      Load More Activities
                      <ChevronDown className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {!hasMore && totalItems > ITEMS_PER_PAGE && (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-gray-600">
                  <span className="text-sm font-medium">You've seen all {totalItems} activities</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ActivitiesPage

