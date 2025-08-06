"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Users,
  MapPin,
} from "lucide-react";
import type { ReliefTeam } from "@/types/relief-team";

interface TeamCardProps {
  team: ReliefTeam;
  onViewDetails: (team: ReliefTeam) => void;
  onEdit: (team: ReliefTeam) => void;
  onDelete: (team: ReliefTeam) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  function getStatusColor(status: string) {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Deployed":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow rounded-lg border border-gray-200 bg-white flex flex-col justify-between">
      <CardHeader className="pb-2 sm:pb-3 px-4 pt-4">
        <div className="flex justify-between items-start">
          <div className="pr-4 flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              {team.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600 truncate">
              Led by {team.teamLeaderName}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(team.status)} px-3 py-1 text-xs font-medium rounded-full self-start`}>
            {team.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-6 pt-1 flex flex-col flex-grow">
        <p className="text-sm text-gray-700 mb-5 leading-relaxed line-clamp-3">
          {team.contactInfo}
        </p>

        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-5 w-5 mr-2 shrink-0 text-gray-400" />
            <span className="truncate">{team.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-5 w-5 mr-2 shrink-0 text-gray-400" />
            <span>{team.numberOfMembers ?? 0} members</span>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Leader:</span> {team.teamLeaderName}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Specialization:</span> {team.specialization}
          </div>
        </div>

        <div className="flex gap-3 justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(team)}
            className="flex items-center px-3 py-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none transition"
            aria-label={`View details of team ${team.name}`}
          >
            <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(team)}
            className="flex items-center px-3 py-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none transition"
            aria-label={`Edit team ${team.name}`}
          >
            <Edit className="h-4 w-4 mr-1" aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(team)}
            className="flex items-center px-3 py-1.5 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:outline-none transition"
            aria-label={`Delete team ${team.name}`}
          >
            <Trash2 className="h-4 w-4 mr-1 text-red-600" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
