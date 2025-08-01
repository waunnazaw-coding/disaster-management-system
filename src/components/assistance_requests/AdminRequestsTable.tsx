import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import { Button } from "@/components/ui/button";
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
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import type { AssistanceRequest } from "@/types/assistanceRequests";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  filterRequests,
  sortRequests,
  paginateRequests,
} from "@/utils/requestUtils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { toast } from "sonner";
import { RequestActionDialog } from "./RequestActionDialog";

interface AdminRequestsTableProps {
  requests: AssistanceRequest[];
  loading?: boolean;
  onStatusChange: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

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
    field: keyof AssistanceRequest;
    direction: "asc" | "desc";
  }>({ field: "createdAt", direction: "desc" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "approve" | "reject" | "fulfill"
  >("approve");
  const [currentRequest, setCurrentRequest] =
    useState<AssistanceRequest | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const processedRequests = useMemo(() => {
    let filtered = filterRequests(requests, filters);
    filtered = sortRequests(filtered, sortConfig);
    return paginateRequests(filtered, currentPage, itemsPerPage);
  }, [requests, filters, sortConfig, currentPage]);

  const totalPages = Math.ceil(
    filterRequests(requests, filters).length / itemsPerPage
  );

  const handleSort = (field: keyof AssistanceRequest) => {
    setSortConfig({
      field,
      direction:
        sortConfig.field === field && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
    setCurrentPage(1);
  };

  const handleActionClick = (
    request: AssistanceRequest,
    action: "approve" | "reject" | "fulfill"
  ) => {
    setCurrentRequest(request);
    setCurrentAction(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!currentRequest) return;

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
      toast.success(`Request has been ${currentAction}d`);
      setDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setDialogLoading(false);
    }
  };

  const SortIndicator = ({ field }: { field: keyof AssistanceRequest }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1 inline" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 inline" />
    );
  };

  return (
    <div className="space-y-4">
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
        loading={dialogLoading}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setCurrentPage(1);
            }}
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => {
            setFilters({ ...filters, status: value });
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("id")}
                  className="flex items-center"
                >
                  ID <SortIndicator field="id" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("disasterEventName")}
                  className="flex items-center"
                >
                  Disaster <SortIndicator field="disasterEventName" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("userName")}
                  className="flex items-center"
                >
                  Requester <SortIndicator field="userName" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("supportType")}
                  className="flex items-center"
                >
                  Support Type <SortIndicator field="supportType" />
                </button>
              </TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("priority")}
                  className="flex items-center"
                >
                  Priority <SortIndicator field="priority" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="flex items-center"
                >
                  Status <SortIndicator field="status" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center"
                >
                  Date <SortIndicator field="createdAt" />
                </button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedRequests.length > 0 ? (
              processedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">#{request.id}</TableCell>
                  <TableCell>{request.disasterEventName || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{request.userName}</span>
                      <span className="text-sm text-muted-foreground">
                        {request.contactPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{request.supportType}</TableCell>
                  <TableCell>
                    {request.quantity} {request.unit}
                  </TableCell>
                  <TableCell>{request.detailedAddress}</TableCell>
                  <TableCell>
                    <RequestPriorityBadge priority={request.priority as any} />
                  </TableCell>
                  <TableCell>
                    <RequestStatusBadge status={request.status as any} />
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={loading}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleActionClick(request, "approve")}
                          disabled={
                            request.status === "Approved" ||
                            request.status === "Rejected" ||
                            request.status === "Fulfilled"
                          }
                        >
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick(request, "reject")}
                          disabled={
                            request.status === "Rejected" ||
                            request.status === "Fulfilled"
                          }
                        >
                          <X className="mr-2 h-4 w-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick(request, "fulfill")}
                          disabled={
                            request.status === "Fulfilled" ||
                            request.status !== "Approved"
                          }
                        >
                          <Truck className="mr-2 h-4 w-4 text-purple-600" />
                          Fulfill
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {processedRequests.length} of{" "}
            {filterRequests(requests, filters).length} requests
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>
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
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};