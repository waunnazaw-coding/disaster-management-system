


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


import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useActivityStore } from "@/store/activityStore"
import ActivityCard from "@/components/activity/ActivityCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ACTIVITY_TYPES } from "@/types/activity"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Filter, ChevronDown, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

  const removeFilter = (type: string, value?: string) => {
    if (type === "search") {
      setSearchTerm("")
    } else if (type === "activityType") {
      setFilterType("all")
    } else if (type === "team" && value) {
      setReliefTeamFilter("all")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-red-100/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Page Header */}
        <div className="mb-10 text-center">
          {/* <div className="inline-block bg-gradient-to-r from-red-600 to-red-700 p-1 rounded-2xl mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-1">
              <span className="text-white/90 text-sm font-medium">Relief Operations</span>
            </div>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-red-700">
         Activities
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover ongoing and past relief activities across different disaster zones. 
            <span className="block mt-1 text-red-600/80 font-medium">
              {activities.length} activities helping communities in need
            </span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>{ACTIVITY_TYPES.length} Activity Types</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>{reliefTeams.length} Relief Teams</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-red-300 rounded-full"></div>
              <span>{activities.length} Total Activities</span>
            </div>
          </div>
        </div>

        {/* Compact Filter Section */}
 <Card className="rounded-xl shadow-md border border-gray-200/70 mb-6 overflow-hidden">
          <CardContent className="p-4">
            {/* <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Filter Activities</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Refine your search using the filters below
                </p>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                <span className="font-medium text-red-600">{totalItems}</span> {totalItems === 1 ? 'activity' : 'activities'} found
              </div>
            </div> */}

            {/* EQUAL WIDTH GRID CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
              {/* Search Input */}
              <div className="relative flex-1 min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleFilterChange()
                  }}
                  className="pl-9 h-10 border-gray-300 focus:border-red-400 rounded-lg w-full"
                />
              </div>

              {/* Activity Type Filter */}
              <div className="relative flex-1 min-w-0">
                <Select
                  value={filterType}
                  onValueChange={(value) => {
                    setFilterType(value)
                    handleFilterChange()
                  }}
                >
                  <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-red-400 w-full">
                    <div className="flex items-center truncate">
                      <Filter className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <SelectValue placeholder="Activity Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
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
              <div className="relative flex-1 min-w-0">
                <Select
                  value={reliefTeamFilter}
                  onValueChange={(value) => {
                    setReliefTeamFilter(value)
                    handleFilterChange()
                  }}
                >
                  <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-red-400 w-full">
                    <div className="flex items-center truncate">
                      <Filter className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <SelectValue placeholder="Relief Team" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
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
              <div className="flex-1 min-w-0">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-10 rounded-lg border-gray-300 hover:border-red-300 hover:bg-red-50 transition-colors w-full"
                  disabled={searchTerm === "" && filterType === "all" && reliefTeamFilter === "all"}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Active Filters - Made more compact */}
            {(searchTerm || filterType !== "all" || reliefTeamFilter !== "all") && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                  
                  {searchTerm && (
                    <Badge 
                      variant="secondary" 
                      className="bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs"
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
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs"
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
                      className="bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs whitespace-nowrap"
                    >
                      Team: {reliefTeams.find((t) => t.id.toString() === reliefTeamFilter)?.name || "Selected Team"}
                      <X 
                        className="h-3 w-3 cursor-pointer flex-shrink-0" 
                        onClick={() => removeFilter("team")}
                      />
                    </Badge>
                  )}
                   <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                <span className="font-medium text-red-600">{totalItems}</span> {totalItems === 1 ? 'activity' : 'activities'} found
              </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activities Grid */}
        {/* ... rest of the component remains the same ... */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden border border-gray-200 shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-5">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
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
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                View All Activities
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Activities Grid */}
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

            {/* Load More Section */}
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
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
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

            {/* End of Results */}
            {!hasMore && totalItems > ITEMS_PER_PAGE && (
              <div className="text-center py-12">
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