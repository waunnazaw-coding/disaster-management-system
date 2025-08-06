// src/pages/admin/AssignRequestPage/components/RequestSummaryCard.tsx
import { AssistanceRequest } from "@/types/assistanceRequests";
import { RequestStatusBadge } from "@/components/assistance_requests/RequestStatusBadge";
import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
import { CalendarDays, MapPin, Box, User, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface RequestSummaryCardProps {
  request: AssistanceRequest;
}

export const RequestSummaryCard = ({ request }: RequestSummaryCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Request Summary</h2>
        <div className="flex gap-2">
          <RequestStatusBadge status={request.status as any} />
          <RequestPriorityBadge priority={request.priority as any} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Disaster Event</h3>
            <p className="text-sm text-muted-foreground">
              {request.disasterEventName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-purple-100 p-2 rounded-lg mt-0.5">
            <Box className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium">Support Type</h3>
            <p className="text-sm text-muted-foreground">
              {request.supportType} ({request.quantity} {request.unit})
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg mt-0.5">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">Location</h3>
            <p className="text-sm text-muted-foreground">
              {request.detailedAddress || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-orange-100 p-2 rounded-lg mt-0.5">
            <User className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium">Requester</h3>
            <p className="text-sm text-muted-foreground">
              {request.userName} • {request.contactPhone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg mt-0.5">
            <CalendarDays className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium">Request Date</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(request.createdAt), "PPpp")}
            </p>
          </div>
        </div>

        {request.description && (
          <div className="pt-2">
            <h3 className="font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
              {request.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};