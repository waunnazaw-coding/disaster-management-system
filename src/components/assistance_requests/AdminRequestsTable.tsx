import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Check,
  X,
  Truck,
  Search,
  Eye,
  Filter,
  Calendar,
  User,
  AlertCircle,
  Box,
  MapPin,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import { AssignRequestDialog } from "../assignments/AssignRequestDialog";
import type { AssistanceRequest } from "@/types/assistanceRequests";
import { AssignmentStatusBadge } from "../assignments/AssignmentStatusBadge";
import { RequestActionDialog } from "./RequestActionDialog";
import { RequestDetailsDialog } from "./RequetsDetailsDialog";
import {  useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminRequestsTableProps {
  requests: AssistanceRequest[];
  loading?: boolean;
  onStatusChange: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

type SortField =
  | keyof AssistanceRequest
  | "assignments.team"
  | "assignments.status";
type SortDirection = "asc" | "desc";

export const AdminRequestsTable = ({
  requests,
  loading,
  onStatusChange,
  onDelete,
}: AdminRequestsTableProps) => {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "approve" | "reject" | "fulfill"
  >("approve");
  const [currentRequest, setCurrentRequest] =
    useState<AssistanceRequest | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [requestToAssign, setRequestToAssign] =
    useState<AssistanceRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<AssistanceRequest | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(
    null
  );
  const [dialogLoading, setDialogLoading] = useState(false);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  const filteredRequests = useMemo(() => {
    const searchTerm = filters.search.toLowerCase();
    return requests.filter((request) => {
      const matchesSearch =
        filters.search === "" ||
        request.userName?.toLowerCase().includes(searchTerm) ||
        request.supportType.toLowerCase().includes(searchTerm) ||
        request.detailedAddress?.toLowerCase().includes(searchTerm) ||
        request.assignments?.[0]?.reliefTeamName
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        filters.status === "all" || request.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || request.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, filters]);

  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      const getValue = (
        request: AssistanceRequest,
        field: SortField
      ): string | number => {
        // Handle assignment fields
        if (field === "assignments.team") {
          return request.assignments?.[0]?.reliefTeamName?.toLowerCase() || "";
        }
        if (field === "assignments.status") {
          return request.assignments?.[0]?.status?.toLowerCase() || "";
        }

        // Handle request fields
        const value = request[field as keyof AssistanceRequest];

        if (value === null || value === undefined) return "";
        if (typeof value === "string") return value.toLowerCase();
        if (typeof value === "number") return value;
        if (typeof value === "object" && "toLowerCase" in value)
          return value.toLowerCase();
        return "";
      };

      const aValue = getValue(a, sortConfig.field);
      const bValue = getValue(b, sortConfig.field);

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRequests, sortConfig]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1 inline" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 inline" />
    );
  };

  const toggleRequestExpansion = (id: number) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  const handleActionClick = (
    request: AssistanceRequest,
    action: "approve" | "reject" | "fulfill"
  ) => {
    setCurrentRequest(request);
    setCurrentAction(action);
    setDialogOpen(true);
  };

 
// Inside handleConfirmAction function
const handleConfirmAction = async () => {
  if (!currentRequest) return;

  const actionMessages = {
    approve: { success: 'approved', error: 'approving' },
    reject: { success: 'rejected', error: 'rejecting' },
    fulfill: { success: 'fulfilled', error: 'fulfilling' },
  };

  try {
    setDialogLoading(true);
    let status = "";
    switch (currentAction) {
      case "approve":
        status = "Approved";
        break;
      case "reject":
        status = "Rejected";
        break;
      case "fulfill":
        status = "Fulfilled";
        break;
    }

    await onStatusChange(currentRequest.id, status);
    
    // Success toast
    toast.success(`Request #${currentRequest.id} ${actionMessages[currentAction].success}`, {
      description: `Support: ${currentRequest.supportType}`,
      action: {
        label: "View",
        onClick: () => handleViewDetails(currentRequest),
      },
    });
    
    setDialogOpen(false);
  } catch (error) {
    // Error toast
    toast.error(`Error ${actionMessages[currentAction].error} request`, {
      description: `Request #${currentRequest.id}`,
    });
    console.error("Failed to update request status:", error);
  } finally {
    setDialogLoading(false);
  }
};
  // Modify handleAssignClick function
const handleAssignClick = (request: AssistanceRequest) => {
  if (request.status === "Rejected" || request.status === "Fulfilled") {
    toast.warning("Cannot assign team", {
      description: `Request #${request.id} is ${request.status.toLowerCase()}`,
    });
  } else if (request.status === "Pending") {
    toast.info("Approve request first", {
      description: "Please approve the request before assigning a team",
    });
  } else {
    navigate(`/admin/assign-request/${request.id}`);
  }
};

  const handleViewDetails = (request: AssistanceRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests, teams..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setFilters({ ...filters, status: value });
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>
                    {filters.status === "all" ? "Status" : filters.status}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.priority}
              onValueChange={(value) => {
                setFilters({ ...filters, priority: value });
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {filters.priority === "all" ? "Priority" : filters.priority}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px]">
                <button
                  type="button"
                  onClick={() => handleSort("id")}
                  className="flex items-center font-medium"
                >
                  ID <SortIndicator field="id" />
                </button>
              </TableHead>
              <TableHead className="w-[100px]">
                <button
                  type="button"
                  onClick={() => handleSort("id")}
                  className="flex items-center font-medium"
                >
                  DisasterName <SortIndicator field="id" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("userName")}
                  className="flex items-center font-medium"
                >
                  Requester <SortIndicator field="userName" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("supportType")}
                  className="flex items-center font-medium"
                >
                  Support Type <SortIndicator field="supportType" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("assignments.team")}
                  className="flex items-center font-medium"
                >
                  Assigned Team <SortIndicator field="assignments.team" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("priority")}
                  className="flex items-center font-medium"
                >
                  Priority <SortIndicator field="priority" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="flex items-center font-medium"
                >
                  Status <SortIndicator field="status" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center font-medium"
                >
                  Request Date <SortIndicator field="createdAt" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((request) => (
                <>
                  <TableRow
                    key={request.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRequestExpansion(request.id)}
                  >
                    <TableCell className="font-medium">#{request.id}</TableCell>
                     <TableCell className="font-medium">{request.disasterEventName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.contactPhone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-muted-foreground" />
                        <span>{request.supportType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.assignments?.length ? (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.assignments[0].reliefTeamName}
                          </span>
                          <AssignmentStatusBadge
                            status={request.assignments[0].status}
                            className="ml-2"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Not assigned</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <RequestPriorityBadge
                        priority={request.priority as any}
                      />
                    </TableCell>
                    <TableCell>
                      <RequestStatusBadge status={request.status as any} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), "PP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(request);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleAssignClick(request)}
                              disabled={
                                request.status === "Rejected" ||
                                request.status === "Fulfilled" ||
                                request.status === "Pending"
                              }
                            >
                              <Truck className="mr-2 h-4 w-4" />
                              Assign Team
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleActionClick(request, "approve")
                              }
                              disabled={
                                request.status === "Approved" ||
                                request.status === "Rejected" ||
                                request.status === "Fulfilled" ||
                                request.status === "InProgress"
                              }
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleActionClick(request, "reject")
                              }
                              disabled={
                                request.status === "Rejected" ||
                                request.status === "Fulfilled"
                              }
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              onClick={() =>
                                handleActionClick(request, "fulfill")
                              }
                              disabled={
                                request.status === "Fulfilled" ||
                                (request.status !== "Approved" &&
                                  request.status !== "InProgress")
                              }
                            >
                              <Truck className="mr-2 h-4 w-4" />
                              Fulfill
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedRequestId === request.id && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={8}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <MapPin className="h-4 w-4" />
                              <span>Location</span>
                            </div>
                            <p className="text-sm">
                              {request.detailedAddress || "Not specified"}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4" />
                              <span>Request Date</span>
                            </div>
                            <p className="text-sm">
                              {format(new Date(request.createdAt), "PPpp")}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Box className="h-4 w-4" />
                              <span>Quantity</span>
                            </div>
                            <p className="text-sm">
                              {request.quantity} {request.unit}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Search className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No requests found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedRequests.length} of {filteredRequests.length}{" "}
            requests
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <RequestActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={currentAction}
        requestId={currentRequest?.id || 0}
        requestDetails={
          currentRequest
            ? {
                userName: currentRequest.userName || null,
                supportType: currentRequest.supportType,
                quantity: currentRequest.quantity || null,
                unit: currentRequest.unit || null,
              }
            : undefined
        }
        onConfirm={handleConfirmAction}
        loading={dialogLoading} // Add this line
      />

      <AssignRequestDialog
        request={requestToAssign}
        open={assignDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAssignDialogOpen(false);
            setRequestToAssign(null);
          }
        }}
      />

      <RequestDetailsDialog
        request={selectedRequest}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};
