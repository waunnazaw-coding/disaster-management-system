import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import type { AssistanceRequest } from "@/types/assistanceRequests";
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  User,
  Box,
  Clock,
  Truck,
  Info,
  FileText,
  AlertCircle,
  Users,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AssignmentStatusBadge } from "../assignments/AssignmentStatusBadge";
import { Separator } from "@/components/ui/separator";

interface RequestDetailsDialogProps {
  request: AssistanceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RequestDetailsDialog = ({
  request,
  open,
  onOpenChange,
}: RequestDetailsDialogProps) => {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl flex items-center gap-3">
                Assistance Request #{request.id}
                <Badge
                  variant="outline"
                  className="border-primary text-primary font-medium"
                >
                  {request.supportType}
                </Badge>
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{request.userName}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {format(new Date(request.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">
                    {request.disasterEventName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="assignment" className="flex gap-2">
              Assignments
              {request.assignments?.length > 0 && (
                <Badge
                  variant="outline"
                  className="h-5 w-5 p-0 flex items-center justify-center"
                >
                  {request.assignments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Basic Information</h3>
                </div>

                <div className="space-y-3 pl-11">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-1">
                      <RequestStatusBadge status={request.status as any} />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <div className="mt-1">
                      <RequestPriorityBadge
                        priority={request.priority as any}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="mt-1">
                      {format(new Date(request.createdAt), "PPpp")}
                    </p>
                  </div>

                  {request.fulfilledAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fulfilled At
                      </p>
                      <p className="mt-1">
                        {format(new Date(request.fulfilledAt), "PPpp")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Box className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Request Details</h3>
                </div>

                <div className="space-y-3 pl-11">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Support Type
                    </p>
                    <p className="mt-1">{request.supportType}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="mt-1">
                      {request.quantity} {request.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="mt-1">
                      {request.detailedAddress || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium">Description</h3>
              </div>

              <div className="pl-11">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="whitespace-pre-line text-sm">
                    {request.description || "No description provided"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-medium">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="mt-1 font-medium">{request.userName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="mt-1 font-medium">{request.contactPhone}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium">
                      {request.email || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="mt-1 font-medium">
                      {request.detailedAddress || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignment" className="mt-6">
            {request.assignments?.length > 0 ? (
              <div className="space-y-6">
                {request.assignments.map((assignment, index) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50">
                          <Truck className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="font-medium">Assignment #{index + 1}</h3>
                      </div>
                      <AssignmentStatusBadge status={assignment.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Team</p>
                          <p className="mt-1 font-medium">
                            {assignment.reliefTeamName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Assigned By
                          </p>
                          <p className="mt-1 font-medium">
                            {assignment.assignedByName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Priority
                          </p>
                          <div className="mt-1">
                            <RequestPriorityBadge
                              priority={assignment.priority as any}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Assigned At
                          </p>
                          <p className="mt-1">
                            {format(new Date(assignment.assignedAt), "PPpp")}
                          </p>
                        </div>

                        {assignment.completedAt && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Completed At
                            </p>
                            <p className="mt-1">
                              {format(new Date(assignment.completedAt), "PPpp")}
                            </p>
                          </div>
                        )}

                        {assignment.notes && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Notes
                            </p>
                            <p className="mt-1 text-sm">{assignment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
                <h4 className="font-medium">No assignments yet</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This request hasn't been assigned to any team
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
