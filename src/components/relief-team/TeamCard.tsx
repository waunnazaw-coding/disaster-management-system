// "use client";

// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Eye,
//   Edit,
//   Trash2,
//   Users,
//   MapPin,
// } from "lucide-react";
// import type { ReliefTeam } from "@/types/relief-team";

// interface TeamCardProps {
//   team: ReliefTeam;
//   onViewDetails: (team: ReliefTeam) => void;
//   onEdit: (team: ReliefTeam) => void;
//   onDelete: (team: ReliefTeam) => void;
// }

// export const TeamCard: React.FC<TeamCardProps> = ({
//   team,
//   onViewDetails,
//   onEdit,
//   onDelete,
// }) => {
//   function getStatusColor(status: string) {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800";
//       case "Deployed":
//         return "bg-blue-100 text-blue-800";
//       case "Inactive":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   }

//   return (
//     <Card className="hover:shadow-lg transition-shadow rounded-lg border border-gray-200 bg-white flex flex-col justify-between">
//       <CardHeader className="pb-2 sm:pb-3 px-4 pt-4">
//         <div className="flex justify-between items-start">
//           <div className="pr-4 flex-1 min-w-0">
//             <CardTitle className="text-lg font-semibold text-gray-900 truncate">
//               {team.name}
//             </CardTitle>
//             <CardDescription className="mt-1 text-sm text-gray-600 truncate">
//               Led by {team.teamLeaderName}
//             </CardDescription>
//           </div>
//           <Badge className={`${getStatusColor(team.status)} px-3 py-1 text-xs font-medium rounded-full self-start`}>
//             {team.status}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="px-4 pb-6 pt-1 flex flex-col flex-grow">
//         <p className="text-sm text-gray-700 mb-5 leading-relaxed line-clamp-3">
//           {team.contactInfo}
//         </p>

//         <div className="space-y-3 mb-6 flex-grow">
//           <div className="flex items-center text-sm text-gray-500">
//             <MapPin className="h-5 w-5 mr-2 shrink-0 text-gray-400" />
//             <span className="truncate">{team.address}</span>
//           </div>
//           <div className="flex items-center text-sm text-gray-500">
//             <Users className="h-5 w-5 mr-2 shrink-0 text-gray-400" />
//             <span>{team.numberOfMembers ?? 0} members</span>
//           </div>
//           <div className="text-sm text-gray-700">
//             <span className="font-medium">Leader:</span> {team.teamLeaderName}
//           </div>
//           <div className="text-sm text-gray-700">
//             <span className="font-medium">Specialization:</span> {team.specialization}
//           </div>
//         </div>

//         <div className="flex gap-3 justify-start">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onViewDetails(team)}
//             className="flex items-center px-3 py-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none transition"
//             aria-label={`View details of team ${team.name}`}
//           >
//             <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
//             View
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onEdit(team)}
//             className="flex items-center px-3 py-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none transition"
//             aria-label={`Edit team ${team.name}`}
//           >
//             <Edit className="h-4 w-4 mr-1" aria-hidden="true" />
//             Edit
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onDelete(team)}
//             className="flex items-center px-3 py-1.5 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:outline-none transition"
//             aria-label={`Delete team ${team.name}`}
//           >
//             <Trash2 className="h-4 w-4 mr-1 text-red-600" aria-hidden="true" />
//             Delete
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Users, MapPin, Shield, Calendar } from "lucide-react"
import type { ReliefTeam } from "@/types/relief-team"

interface TeamCardProps {
  team: ReliefTeam
  onViewDetails: (team: ReliefTeam) => void
  onEdit: (team: ReliefTeam) => void
  onDelete: (team: ReliefTeam) => void
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onViewDetails, onEdit, onDelete }) => {
  function getStatusColor(status: string) {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Deployed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Inactive":
        return "bg-gray-50 text-gray-600 border-gray-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "Active":
        return <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      case "Deployed":
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      case "Inactive":
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    }
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-gray-200 hover:-translate-y-1">
      <CardHeader className="pb-4 px-6 pt-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            <CardTitle className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {team.name}
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Led by {team.teamLeaderName}
            </CardDescription>
          </div>
          <Badge
            className={`${getStatusColor(team.status)} px-3 py-1.5 text-xs font-semibold rounded-full border flex items-center gap-2`}
          >
            {getStatusIcon(team.status)}
            {team.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2">
        {/* Contact Info */}
        <p className="text-sm text-gray-700 mb-6 leading-relaxed line-clamp-2 bg-gray-50 p-3 rounded-lg">
          {team.contactInfo}
        </p>

        {/* Team Details Grid */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">Location</p>
              <p className="text-gray-600 truncate">{team.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Team Size</p>
              <p className="text-gray-600">{team.numberOfMembers ?? 0} members</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">Specialization</p>
              <p className="text-gray-600 truncate">{team.specialization}</p>
            </div>
          </div>

          {team.establishedDate && (
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Established</p>
                <p className="text-gray-600">{new Date(team.establishedDate).getFullYear()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(team)}
            className="flex-1 h-10 rounded-lg border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all group/btn"
          >
            <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(team)}
            className="flex-1 h-10 rounded-lg border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all group/btn"
          >
            <Edit className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(team)}
            className="h-10 px-3 rounded-lg border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all group/btn"
          >
            <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
