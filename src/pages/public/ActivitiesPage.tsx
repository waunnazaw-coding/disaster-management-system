


// // "use client"

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
// //   const { activities, loading, reliefTeams, fetchActivities, fetchReliefTeams } = useActivityStore()

// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [filterType, setFilterType] = useState<string>("all")
// //   const [reliefTeamFilter, setReliefTeamFilter] = useState<string>("all")
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [isLoadingMore, setIsLoadingMore] = useState(false)
// //   const navigate = useNavigate()

// //   useEffect(() => {
// //     fetchActivities()
// //     fetchReliefTeams()
// //   }, [fetchActivities, fetchReliefTeams])

// //   const filteredActivities = activities.filter((activity) => {
// //     const q = searchTerm.trim().toLowerCase()
// //     const matchesSearch =
// //       !q ||
// //       activity.title.toLowerCase().includes(q) ||
// //       activity.description.toLowerCase().includes(q) ||
// //       activity.reliefTeamName?.toLowerCase().includes(q)

// //     const matchesType = filterType === "all" ? true : activity.activityType === filterType
// //     const matchesTeam = reliefTeamFilter === "all" ? true : activity.reliefTeamId === Number.parseInt(reliefTeamFilter)

// //     return matchesSearch && matchesType && matchesTeam
// //   })

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
// //     setReliefTeamFilter("all")
// //     setCurrentPage(1)
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
// //       <div className="relative overflow-hidden bg-gradient-to-r from-red-900 via-red-800 to-red-700">
// //         <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-10"></div>
// //         <div className="relative container mx-auto px-4 py-16 text-center">
// //           <div className="mx-auto max-w-4xl">
// //             <h1 className="text-5xl font-bold tracking-tight text-white mb-6">Relief Activities</h1>
// //             <p className="text-xl text-red-100 leading-relaxed max-w-3xl mx-auto">
// //               Discover ongoing and past relief activities across different disaster zones. See how dedicated teams are
// //               making a real difference in affected communities worldwide.
// //             </p>
// //             <div className="mt-8 flex items-center justify-center gap-8 text-red-200">
// //               <div className="text-center">
// //                 <div className="text-2xl font-bold text-white">{activities.length}</div>
// //                 <div className="text-sm">Total Activities</div>
// //               </div>
// //               <div className="h-8 w-px bg-red-400/30"></div>
// //               <div className="text-center">
// //                 <div className="text-2xl font-bold text-white">{ACTIVITY_TYPES.length}</div>
// //                 <div className="text-sm">Activity Types</div>
// //               </div>
// //               <div className="h-8 w-px bg-red-400/30"></div>
// //               <div className="text-center">
// //                 <div className="text-2xl font-bold text-white">{reliefTeams.length}</div>
// //                 <div className="text-sm">Relief Teams</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="container mx-auto px-4 py-12">
// //         {/* Enhanced Filters Section */}
// //         <div className="mb-12">
// //           <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 p-6 md:p-8">
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
// //                   className="pl-12 h-14 text-base md:text-lg border-gray-200 focus:border-red-500 focus:ring-red-500/20 rounded-2xl"
// //                 />
// //               </div>

// //               <div className="relative flex items-center">
// //                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// //                   <Filter className="h-5 w-5 text-gray-400" />
// //                 </div>
// //                 <Select
// //                   value={filterType}
// //                   onValueChange={(value) => {
// //                     setFilterType(value)
// //                     handleFilterChange()
// //                   }}
// //                 >
// //                   <SelectTrigger className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-red-500 text-left truncate pl-12 !min-h-0">
// //                     <SelectValue placeholder="All Types" />
// //                   </SelectTrigger>
// //                   <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
// //                     <SelectItem value="all" className="text-base md:text-lg py-3">
// //                       All Activity Types
// //                     </SelectItem>
// //                     {ACTIVITY_TYPES.map((type) => (
// //                       <SelectItem key={type} value={type} className="text-base md:text-lg py-3">
// //                         {type}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div className="relative flex items-center">
// //                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// //                   <Filter className="h-5 w-5 text-gray-400" />
// //                 </div>
// //                 <Select
// //                   value={reliefTeamFilter}
// //                   onValueChange={(value) => {
// //                     setReliefTeamFilter(value)
// //                     handleFilterChange()
// //                   }}
// //                 >
// //                   <SelectTrigger className="h-14 rounded-2xl text-base md:text-lg border-gray-200 focus:border-red-500 text-left truncate pl-12 !min-h-0">
// //                     <SelectValue placeholder="All Teams" className="truncate max-w-[80%]" />
// //                   </SelectTrigger>
// //                   <SelectContent className="rounded-2xl border-gray-200 max-h-[300px] overflow-y-auto">
// //                     <SelectItem value="all" className="text-base md:text-lg py-3">
// //                       All Relief Teams
// //                     </SelectItem>
// //                     {reliefTeams.map((team) => (
// //                       <SelectItem
// //                         key={team.id}
// //                         value={team.id.toString()}
// //                         className="text-base md:text-lg py-3 truncate"
// //                       >
// //                         {team.name}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <Button
// //                 variant="outline"
// //                 className="h-14 rounded-2xl text-base md:text-lg font-medium border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 bg-transparent flex items-center justify-center"
// //                 onClick={clearFilters}
// //               >
// //                 <RefreshCw className="h-5 w-5 mr-2 flex-shrink-0" />
// //                 <span className="truncate">Clear</span>
// //               </Button>
// //             </div>

// //             {/* Filter Summary */}
// //             {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all") && (
// //               <div className="mt-6 pt-6 border-t border-gray-100">
// //                 <div className="flex flex-wrap items-center gap-2">
// //                   <span className="text-sm text-gray-600">
// //                     Showing {displayedActivities.length} of {totalItems} activities
// //                   </span>

// //                   {searchTerm && (
// //                     <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm whitespace-nowrap">
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
// //                       Team: {reliefTeams.find((t) => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"}
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
// //               <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto mb-4" />
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
// //                 className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200"
// //               >
// //                 View All Activities
// //               </Button>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 auto-rows-fr">
// //               {displayedActivities.map((activity, index) => (
// //                 <div
// //                   key={activity.id}
// //                   className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full"
// //                   style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
// //                 >
// //                   <ActivityCard activity={activity} onView={() => navigate(`/activities/${activity.id}`)} />
// //                 </div>
// //               ))}
// //             </div>

// //             {hasMore && (
// //               <div className="text-center">
// //                 <div className="mb-6">
// //                   <div className="text-sm text-gray-500 mb-2">
// //                     Showing {displayedActivities.length} of {totalItems} activities
// //                   </div>
// //                   <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
// //                     <div
// //                       className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
// //                       style={{ width: `${(displayedActivities.length / totalItems) * 100}%` }}
// //                     ></div>
// //                   </div>
// //                 </div>
// //                 <Button
// //                   onClick={handleLoadMore}
// //                   disabled={isLoadingMore}
// //                   className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
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


// import type React from "react"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useActivityStore } from "@/store/activityStore"
// import ActivityCard from "@/components/activity/ActivityCard"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ACTIVITY_TYPES } from "@/types/activity"
// import { Button } from "@/components/ui/button"
// import { Loader2, Search, Filter, ChevronDown, X } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

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

//   const removeFilter = (type: string, value?: string) => {
//     if (type === "search") {
//       setSearchTerm("")
//     } else if (type === "activityType") {
//       setFilterType("all")
//     } else if (type === "team" && value) {
//       setReliefTeamFilter("all")
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Enhanced Page Header */}
//         <div className="mb-10 text-center">
//           {/* <div className="inline-block bg-gradient-to-r from-red-600 to-red-700 p-1 rounded-2xl mb-6">
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-1">
//               <span className="text-white/90 text-sm font-medium">Relief Operations</span>
//             </div>
//           </div> */}
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-red-700">
//          Activities
//           </h1>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Discover ongoing and past relief activities across different disaster zones. 
//             <span className="block mt-1 text-red-600/80 font-medium">
//               {activities.length} activities helping communities in need
//             </span>
//           </p>
          
//           <div className="flex flex-wrap justify-center gap-6 mt-8">
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//               <span>{ACTIVITY_TYPES.length} Activity Types</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <div className="w-3 h-3 bg-red-400 rounded-full"></div>
//               <span>{reliefTeams.length} Relief Teams</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <div className="w-3 h-3 bg-red-300 rounded-full"></div>
//               <span>{activities.length} Total Activities</span>
//             </div>
//           </div>
//         </div>

//         {/* Compact Filter Section */}
//  <Card className="rounded-xl shadow-md border border-gray-200/70 mb-6 overflow-hidden">
//           <CardContent className="p-4">
//             {/* <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">Filter Activities</h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Refine your search using the filters below
//                 </p>
//               </div>
//               <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
//                 <span className="font-medium text-red-600">{totalItems}</span> {totalItems === 1 ? 'activity' : 'activities'} found
//               </div>
//             </div> */}

//             {/* EQUAL WIDTH GRID CONTAINER */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
//               {/* Search Input */}
//               <div className="relative flex-1 min-w-0">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-4 w-4 text-gray-400" />
//                 </div>
//                 <Input
//                   placeholder="Search activities..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value)
//                     handleFilterChange()
//                   }}
//                   className="pl-9 h-10 border-gray-300 focus:border-red-400 rounded-lg w-full"
//                 />
//               </div>

//               {/* Activity Type Filter */}
//               <div className="relative flex-1 min-w-0">
//                 <Select
//                   value={filterType}
//                   onValueChange={(value) => {
//                     setFilterType(value)
//                     handleFilterChange()
//                   }}
//                 >
//                   <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-red-400 w-full">
//                     <div className="flex items-center truncate">
//                       <Filter className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
//                       <SelectValue placeholder="Activity Type" />
//                     </div>
//                   </SelectTrigger>
//                   <SelectContent className="rounded-lg">
//                     <SelectItem value="all">All Activity Types</SelectItem>
//                     {ACTIVITY_TYPES.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Relief Team Filter */}
//               <div className="relative flex-1 min-w-0">
//                 <Select
//                   value={reliefTeamFilter}
//                   onValueChange={(value) => {
//                     setReliefTeamFilter(value)
//                     handleFilterChange()
//                   }}
//                 >
//                   <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-red-400 w-full">
//                     <div className="flex items-center truncate">
//                       <Filter className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
//                       <SelectValue placeholder="Relief Team" />
//                     </div>
//                   </SelectTrigger>
//                   <SelectContent className="rounded-lg">
//                     <SelectItem value="all">All Relief Teams</SelectItem>
//                     {reliefTeams.map((team) => (
//                       <SelectItem key={team.id} value={team.id.toString()}>
//                         {team.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Clear Filters Button */}
//               <div className="flex-1 min-w-0">
//                 <Button
//                   variant="outline"
//                   onClick={clearFilters}
//                   className="h-10 rounded-lg border-gray-300 hover:border-red-300 hover:bg-red-50 transition-colors w-full"
//                   disabled={searchTerm === "" && filterType === "all" && reliefTeamFilter === "all"}
//                 >
//                   Clear Filters
//                 </Button>
//               </div>
//             </div>

//             {/* Active Filters - Made more compact */}
//             {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all") && (
//               <div className="mt-4 pt-3 border-t border-gray-100">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                  
//                   {searchTerm && (
//                     <Badge 
//                       variant="secondary" 
//                       className="bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs"
//                     >
//                       Search: "{searchTerm}"
//                       <X 
//                         className="h-3 w-3 cursor-pointer" 
//                         onClick={() => removeFilter("search")}
//                       />
//                     </Badge>
//                   )}
                  
//                   {filterType !== "all" && (
//                     <Badge 
//                       variant="secondary" 
//                       className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs"
//                     >
//                       Type: {filterType}
//                       <X 
//                         className="h-3 w-3 cursor-pointer" 
//                         onClick={() => removeFilter("activityType")}
//                       />
//                     </Badge>
//                   )}
                  
//                   {reliefTeamFilter !== "all" && (
//                     <Badge 
//                       variant="secondary" 
//                       className="bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs whitespace-nowrap"
//                     >
//                       Team: {reliefTeams.find((t) => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"}
//                       <X 
//                         className="h-3 w-3 cursor-pointer flex-shrink-0" 
//                         onClick={() => removeFilter("team")}
//                       />
//                     </Badge>
//                   )}
//                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
//                 <span className="font-medium text-red-600">{totalItems}</span> {totalItems === 1 ? 'activity' : 'activities'} found
//               </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Activities Grid */}
//         {/* ... rest of the component remains the same ... */}
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <Card key={i} className="overflow-hidden border border-gray-200 shadow-sm">
//                 <div className="h-48 bg-gray-200 animate-pulse"></div>
//                 <CardContent className="p-5">
//                   <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
//                   <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
//                   <div className="flex justify-between items-center">
//                     <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
//                     <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : filteredActivities.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="mx-auto max-w-md">
//               <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                 <Search className="h-12 w-12 text-gray-400" />
//               </div>
//               <h3 className="text-2xl font-semibold text-gray-800 mb-3">No activities found</h3>
//               <p className="text-gray-600 mb-8 leading-relaxed">
//                 We couldn't find any activities matching your search criteria. Try adjusting your filters or search terms.
//               </p>
//               <Button
//                 onClick={clearFilters}
//                 className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
//               >
//                 View All Activities
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Activities Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {displayedActivities.map((activity, index) => (
//                 <div
//                   key={activity.id}
//                   className="animate-in fade-in slide-in-from-bottom-4 duration-500"
//                   style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
//                 >
//                   <ActivityCard activity={activity} onView={() => navigate(`/activities/${activity.id}`)} />
//                 </div>
//               ))}
//             </div>

//             {/* Load More Section */}
//             {hasMore && (
//               <div className="text-center mt-12">
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
//                   className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
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

//             {/* End of Results */}
//             {!hasMore && totalItems > ITEMS_PER_PAGE && (
//               <div className="text-center py-12">
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


// import type React from "react"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useActivityStore } from "@/store/activityStore"
// import ActivityCard from "@/components/activity/ActivityCard"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ACTIVITY_TYPES } from "@/types/activity"
// import { Button } from "@/components/ui/button"
// import { Loader2, Search, Filter, ChevronDown, X, MapPin, Users, Calendar } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const ITEMS_PER_PAGE = 9

// const ActivitiesPage: React.FC = () => {
//   const { activities, loading, reliefTeams, fetchActivities, fetchReliefTeams } = useActivityStore()

//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterType, setFilterType] = useState<string>("all")
//   const [reliefTeamFilter, setReliefTeamFilter] = useState<string>("all")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isLoadingMore, setIsLoadingMore] = useState(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     fetchActivities()
//     fetchReliefTeams()
//   }, [fetchActivities, fetchReliefTeams])

//   // Get current date for status filtering
//   const currentDate = new Date()

//   const filteredActivities = activities.filter((activity) => {
//     const q = searchTerm.trim().toLowerCase()
//     const matchesSearch =
//       !q ||
//       activity.title.toLowerCase().includes(q) ||
//       activity.description.toLowerCase().includes(q) ||
//       activity.reliefTeamName?.toLowerCase().includes(q)

//     const matchesType = filterType === "all" ? true : activity.activityType === filterType
//     const matchesTeam = reliefTeamFilter === "all" ? true : activity.reliefTeamId === Number.parseInt(reliefTeamFilter)
    
//     // Status filtering
//     let matchesStatus = true
//     if (statusFilter !== "all") {
//       const startDate = new Date(activity.startDate)
//       const endDate = new Date(activity.endDate)
      
//       if (statusFilter === "ongoing") {
//         matchesStatus = startDate <= currentDate && endDate >= currentDate
//       } else if (statusFilter === "upcoming") {
//         matchesStatus = startDate > currentDate
//       } else if (statusFilter === "completed") {
//         matchesStatus = endDate < currentDate
//       }
//     }

//     return matchesSearch && matchesType && matchesTeam && matchesStatus
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
//     setStatusFilter("all")
//     setCurrentPage(1)
//   }

//   const removeFilter = (type: string, value?: string) => {
//     if (type === "search") {
//       setSearchTerm("")
//     } else if (type === "activityType") {
//       setFilterType("all")
//     } else if (type === "team" && value) {
//       setReliefTeamFilter("all")
//     } else if (type === "status") {
//       setStatusFilter("all")
//     }
//   }

//   // // Count activities by status
//   // const ongoingCount = activities.filter(a => {
//   //   const start = new Date(a.startDate)
//   //   const end = new Date(a.endDate)
//   //   return start <= currentDate && end >= currentDate
//   // }).length

//   // const upcomingCount = activities.filter(a => new Date(a.startDate) > currentDate).length
//   // const completedCount = activities.filter(a => new Date(a.endDate) < currentDate).length

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
//       {/* Hero Section with Image */}
//       <div className="relative h-96 overflow-hidden">
//         <div 
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: "url('https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
//           }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-800/60"></div>
//         </div>
        
//         <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
//           <div className="max-w-3xl">
//             <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm border-0 px-3 py-1 hover:bg-white/30">
//               Making a Difference Together
//             </Badge>
//             <h1 className="text-5xl font-bold text-white mb-4">Relief Activities</h1>
//             <p className="text-xl text-red-100 mb-8 max-w-2xl">
//               Discover how our dedicated teams provide essential support and make a real impact in communities affected by disasters worldwide.
//             </p>
            
//             <div className="flex flex-wrap gap-6 text-white">
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-white/20 rounded-full">
//                   <Users className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="font-bold text-2xl">{reliefTeams.length}</div>
//                   <div className="text-sm">Relief Teams</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-white/20 rounded-full">
//                   <Calendar className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="font-bold text-2xl">{activities.length}</div>
//                   <div className="text-sm">Total Activities</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-white/20 rounded-full">
//                   <MapPin className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="font-bold text-2xl">{ACTIVITY_TYPES.length}</div>
//                   <div className="text-sm">Activity Types</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12 -mt-16 relative z-10">
//         {/* Main Content Card */}
//         <Card className="rounded-2xl shadow-xl border-0 overflow-hidden">
//           <CardContent className="p-6 md:p-8">
//             {/* Status Tabs */}
//             {/* <div className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Status</h2>
//               <Tabs 
//                 value={statusFilter} 
//                 onValueChange={(value) => {
//                   setStatusFilter(value)
//                   handleFilterChange()
//                 }}
//                 className="w-full"
//               >
//                 <TabsList className="grid grid-cols-4 gap-2 bg-gray-100 p-1 h-auto">
//                   <TabsTrigger 
//                     value="all" 
//                     className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 rounded-lg"
//                   >
//                     <div className="flex flex-col items-center">
//                       <span className="font-semibold">All</span>
//                       <span className="text-xs text-gray-500 mt-1">{activities.length}</span>
//                     </div>
//                   </TabsTrigger>
//                   <TabsTrigger 
//                     value="ongoing" 
//                     className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm py-3 rounded-lg"
//                   >
//                     <div className="flex flex-col items-center">
//                       <span className="font-semibold">Ongoing</span>
//                       <span className="text-xs text-gray-500 mt-1">{ongoingCount}</span>
//                     </div>
//                   </TabsTrigger>
//                   <TabsTrigger 
//                     value="upcoming" 
//                     className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm py-3 rounded-lg"
//                   >
//                     <div className="flex flex-col items-center">
//                       <span className="font-semibold">Upcoming</span>
//                       <span className="text-xs text-gray-500 mt-1">{upcomingCount}</span>
//                     </div>
//                   </TabsTrigger>
//                   <TabsTrigger 
//                     value="completed" 
//                     className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-3 rounded-lg"
//                   >
//                     <div className="flex flex-col items-center">
//                       <span className="font-semibold">Completed</span>
//                       <span className="text-xs text-gray-500 mt-1">{completedCount}</span>
//                     </div>
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div> */}

//             {/* Filters Section */}
//             <div className="mb-10">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">Find Activities</h2>
//                   <p className="text-gray-600 mt-1">
//                     Refine your search using the filters below
//                   </p>
//                 </div>
//                 <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm">
//                   <span className="font-bold">{totalItems}</span> {totalItems === 1 ? 'activity' : 'activities'} found
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {/* Search Input */}
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="h- w-5 text-gray-400" />
//                   </div>
//                   <Input
//                     placeholder="Search activities..."
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value)
//                       handleFilterChange()
//                     }}
//                     className="pl-10 h-12 rounded-xl border-gray-300 focus:border-red-400"
//                   />
//                 </div>

//                 {/* Activity Type Filter */}
//                 <Select
//                   value={filterType}
//                   onValueChange={(value) => {
//                     setFilterType(value)
//                     handleFilterChange()
//                   }}
//                 >
//                   <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-red-400">
//                     <div className="flex items-center">
//                       <Filter className="h-5 w-5 text-gray-400 mr-2" />
//                       <SelectValue placeholder="Activity Type" />
//                     </div>
//                   </SelectTrigger>
//                   <SelectContent className="rounded-xl">
//                     <SelectItem value="all">All Activity Types</SelectItem>
//                     {ACTIVITY_TYPES.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Relief Team Filter */}
//                 <Select
//                   value={reliefTeamFilter}
//                   onValueChange={(value) => {
//                     setReliefTeamFilter(value)
//                     handleFilterChange()
//                   }}
//                 >
//                   <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-red-400">
//                     <div className="flex items-center">
//                       <Users className="h-5 w-5 text-gray-400 mr-2" />
//                       <SelectValue placeholder="Relief Team" />
//                     </div>
//                   </SelectTrigger>
//                   <SelectContent className="rounded-xl">
//                     <SelectItem value="all">All Relief Teams</SelectItem>
//                     {reliefTeams.map((team) => (
//                       <SelectItem key={team.id} value={team.id.toString()}>
//                         {team.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Clear Filters Button */}
//                 <Button
//                   variant="outline"
//                   onClick={clearFilters}
//                   className="h-12 rounded-xl border-gray-300 hover:border-red-300 hover:bg-red-50 transition-colors"
//                   disabled={searchTerm === "" && filterType === "all" && reliefTeamFilter === "all" && statusFilter === "all"}
//                 >
//                   Clear Filters
//                 </Button>
//               </div>

//               {/* Active Filters */}
//               {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all" || statusFilter !== "all") && (
//                 <div className="mt-6 pt-6 border-t border-gray-100">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <span className="text-sm text-gray-500 font-medium">Active filters:</span>
                    
//                     {searchTerm && (
//                       <Badge 
//                         variant="secondary" 
//                         className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 rounded-full flex items-center gap-1"
//                       >
//                         Search: "{searchTerm}"
//                         <X 
//                           className="h-3 w-3 cursor-pointer" 
//                           onClick={() => removeFilter("search")}
//                         />
//                       </Badge>
//                     )}
                    
//                     {filterType !== "all" && (
//                       <Badge 
//                         variant="secondary" 
//                         className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1"
//                       >
//                         Type: {filterType}
//                         <X 
//                           className="h-3 w-3 cursor-pointer" 
//                           onClick={() => removeFilter("activityType")}
//                         />
//                       </Badge>
//                     )}
                    
//                     {reliefTeamFilter !== "all" && (
//                       <Badge 
//                         variant="secondary" 
//                         className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded-full flex items-center gap-1"
//                       >
//                         Team: {reliefTeams.find((t) => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"}
//                         <X 
//                           className="h-3 w-3 cursor-pointer" 
//                           onClick={() => removeFilter("team")}
//                         />
//                       </Badge>
//                     )}
                    
//                     {statusFilter !== "all" && (
//                       <Badge 
//                         variant="secondary" 
//                         className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1"
//                       >
//                         Status: {statusFilter}
//                         <X 
//                           className="h-3 w-3 cursor-pointer" 
//                           onClick={() => removeFilter("status")}
//                         />
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Activities Grid */}
//             {loading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[...Array(6)].map((_, i) => (
//                   <Card key={i} className="overflow-hidden border border-gray-200 shadow-sm animate-pulse">
//                     <div className="h-48 bg-gray-200"></div>
//                     <CardContent className="p-5">
//                       <div className="h-6 bg-gray-200 rounded mb-3"></div>
//                       <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                       <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
//                       <div className="flex justify-between items-center">
//                         <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
//                         <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : filteredActivities.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="mx-auto max-w-md">
//                   <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                     <Search className="h-12 w-12 text-gray-400" />
//                   </div>
//                   <h3 className="text-2xl font-semibold text-gray-800 mb-3">No activities found</h3>
//                   <p className="text-gray-600 mb-8 leading-relaxed">
//                     We couldn't find any activities matching your search criteria. Try adjusting your filters or search terms.
//                   </p>
//                   <Button
//                     onClick={clearFilters}
//                     className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium"
//                   >
//                     View All Activities
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {displayedActivities.map((activity, index) => (
//                     <div
//                       key={activity.id}
//                       className="animate-in fade-in slide-in-from-bottom-4 duration-500"
//                       style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
//                     >
//                       <ActivityCard activity={activity} onView={() => navigate(`/activities/${activity.id}`)} />
//                     </div>
//                   ))}
//                 </div>

//                 {hasMore && (
//                   <div className="text-center mt-12">
//                     <div className="mb-6">
//                       <div className="text-sm text-gray-500 mb-2">
//                         Showing {displayedActivities.length} of {totalItems} activities
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
//                         <div
//                           className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
//                           style={{ width: `${(displayedActivities.length / totalItems) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <Button
//                       onClick={handleLoadMore}
//                       disabled={isLoadingMore}
//                       className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
//                     >
//                       {isLoadingMore ? (
//                         <>
//                           <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                           Loading more...
//                         </>
//                       ) : (
//                         <>
//                           Load More Activities
//                           <ChevronDown className="h-5 w-5 ml-2" />
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 )}

//                 {!hasMore && totalItems > ITEMS_PER_PAGE && (
//                   <div className="text-center py-12">
//                     <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-gray-600">
//                       <span className="text-sm font-medium">You've seen all {totalItems} activities</span>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default ActivitiesPage



import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useActivityStore } from "@/store/activityStore"
import ActivityCard from "@/components/activity/ActivityCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ACTIVITY_TYPES } from "@/types/activity"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Filter, ChevronDown, X, MapPin, Users, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ITEMS_PER_PAGE = 6

const ActivitiesPage: React.FC = () => {
  const { activities, loading, reliefTeams, fetchActivities, fetchReliefTeams } = useActivityStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [reliefTeamFilter, setReliefTeamFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchActivities()
    fetchReliefTeams()
  }, [fetchActivities, fetchReliefTeams])

  // Get current date for status filtering
  const currentDate = new Date()

  const filteredActivities = activities.filter((activity) => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !q ||
      activity.title.toLowerCase().includes(q) ||
      activity.description.toLowerCase().includes(q) ||
      activity.reliefTeamName?.toLowerCase().includes(q)

    const matchesType = filterType === "all" ? true : activity.activityType === filterType
    const matchesTeam = reliefTeamFilter === "all" ? true : activity.reliefTeamId === Number.parseInt(reliefTeamFilter)
    
    // Status filtering
    let matchesStatus = true
    // if (statusFilter !== "all") {
    //   const startDate = new Date(activity.startDate)
    //   const endDate = new Date(activity.endDate)
      
    //   if (statusFilter === "ongoing") {
    //     matchesStatus = startDate <= currentDate && endDate >= currentDate
    //   } else if (statusFilter === "upcoming") {
    //     matchesStatus = startDate > currentDate
    //   } else if (statusFilter === "completed") {
    //     matchesStatus = endDate < currentDate
    //   }
    // }

    return matchesSearch && matchesType && matchesTeam && matchesStatus
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
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const removeFilter = (type: string, value?: string) => {
    if (type === "search") {
      setSearchTerm("")
    } else if (type === "activityType") {
      setFilterType("all")
    } else if (type === "team" && value) {
      setReliefTeamFilter("all")
    } else if (type === "status") {
      setStatusFilter("all")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30">
      {/* Hero Section with Image */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-800/60"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm border-0 px-3 py-1 hover:bg-white/30">
              Making a Difference Together
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">Relief Activities</h1>
            <p className="text-xl text-red-100 mb-8 max-w-2xl">
              Discover how our dedicated teams provide essential support and make a real impact in communities affected by disasters worldwide.
            </p>
            
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-2xl">{reliefTeams.length}</div>
                  <div className="text-sm">Relief Teams</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-2xl">{activities.length}</div>
                  <div className="text-sm">Total Activities</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-2xl">{ACTIVITY_TYPES.length}</div>
                  <div className="text-sm">Activity Types</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       <div className="max-w-6xl mx-auto px-4 py-12 -mt-16 relative z-10">
        {/* Main Content Card */}
        <Card className="rounded-2xl shadow-xl border-0 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {/* Filters Section */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Find Activities</h2>
                  <p className="text-gray-600 mt-1">
                    Refine your search using the filters below
                  </p>
                </div>
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm">
                  <span className="font-bold">{totalItems}</span> {totalItems === 1 ? 'activity' : 'activities'} found
                </div>
              </div>

              {/* UPDATED FILTER CONTAINER - FIXED HEIGHTS AND SPACING */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      handleFilterChange()
                    }}
                    className="h-12 pl-10 rounded-xl border-gray-300 focus:border-red-400"
                  />
                </div>

                {/* Activity Type Filter */}
                <div className="flex-1">
                  <Select
                    value={filterType}
                    onValueChange={(value) => {
                      setFilterType(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-red-400 w-full">
                      <div className="flex items-center">
                        <Filter className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                        <SelectValue placeholder="Activity Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Activity Types</SelectItem>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Relief Team Filter */}
                <div className="flex-1">
                  <Select
                    value={reliefTeamFilter}
                    onValueChange={(value) => {
                      setReliefTeamFilter(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-red-400 w-full">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                        <SelectValue placeholder="Relief Team" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Relief Teams</SelectItem>
                      {reliefTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="h-12 rounded-xl border-gray-300 hover:border-red-300 hover:bg-red-50 transition-colors w-full"
                    disabled={searchTerm === "" && filterType === "all" && reliefTeamFilter === "all" && statusFilter === "all"}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all" || statusFilter !== "all") && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">Active filters:</span>
                    
                    {searchTerm && (
                      <Badge 
                        variant="secondary" 
                        className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        Search: "{searchTerm}"
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter("search")}
                        />
                      </Badge>
                    )}
                    
                    {filterType !== "all" && (
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        Type: {filterType}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter("activityType")}
                        />
                      </Badge>
                    )}
                    
                    {reliefTeamFilter !== "all" && (
                      <Badge 
                        variant="secondary" 
                        className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        Team: {reliefTeams.find((t) => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter("team")}
                        />
                      </Badge>
                    )}
                    
                    {statusFilter !== "all" && (
                      <Badge 
                        variant="secondary" 
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        Status: {statusFilter}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter("status")}
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Activities Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden border border-gray-200 shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-5">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">No activities found</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    We couldn't find any activities matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    View All Activities
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
                    >
                      <ActivityCard activity={activity} onView={() => navigate(`/activities/${activity.id}`)} />
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-12">
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
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
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
                  <div className="text-center py-12">
                    <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-gray-600">
                      <span className="text-sm font-medium">You've seen all {totalItems} activities</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ActivitiesPage