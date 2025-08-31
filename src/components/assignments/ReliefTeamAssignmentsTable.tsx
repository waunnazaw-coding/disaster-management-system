import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssignmentStatusBadge } from "@/components/assignments/AssignmentStatusBadge";
import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { AssignmentStatusActions } from "@/components/assignments/AssignmentStatusActions";
import type { RequestAssignment } from "@/types/requestAssignments";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

interface ReliefAssignmentsTableProps {
  assignments: RequestAssignment[];
  loading: boolean;
  onStatusChange: (id: number, status: string) => Promise<void>;
  onViewDetails: (assignment: RequestAssignment) => void;
  selectedAssignmentId?: number | null;
}

type SortColumn =
  | "id"
  | "request"
  | "disaster"
  | "priority"
  | "status"
  | "assignedAt";
type SortDirection = "asc" | "desc";

export const ReliefAssignmentsTable = ({
  assignments,
  loading,
  onStatusChange,
  onViewDetails,
  selectedAssignmentId,
}: ReliefAssignmentsTableProps) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [showScrollShadow, setShowScrollShadow] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    column: SortColumn;
    direction: SortDirection;
  }>({ column: "assignedAt", direction: "desc" });

  const handleSort = (column: SortColumn) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    switch (sortConfig.column) {
      case "id":
        return sortConfig.direction === "asc" ? a.id - b.id : b.id - a.id;
      case "request":
        return sortConfig.direction === "asc"
          ? a.requestDetails.supportType.localeCompare(
              b.requestDetails.supportType
            )
          : b.requestDetails.supportType.localeCompare(
              a.requestDetails.supportType
            );
      case "disaster":
        return sortConfig.direction === "asc"
          ? a.requestDetails.disasterEventName.localeCompare(
              b.requestDetails.disasterEventName
            )
          : b.requestDetails.disasterEventName.localeCompare(
              a.requestDetails.disasterEventName
            );
      case "priority":
        const priorityOrder = { Low: 0, Medium: 1, High: 2, Critical: 3 };
        return sortConfig.direction === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      case "status":
        return sortConfig.direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      case "assignedAt":
        return sortConfig.direction === "asc"
          ? new Date(a.assignedAt).getTime() - new Date(b.assignedAt).getTime()
          : new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime();
      default:
        return 0;
    }
  });

  useEffect(() => {
    const tableElement = tableRef.current;

    const checkScroll = () => {
      if (tableElement) {
        const { scrollTop, scrollHeight, clientHeight } = tableElement;
        setShowScrollShadow(scrollTop + clientHeight < scrollHeight - 10);
      }
    };

    tableElement?.addEventListener("scroll", checkScroll);
    checkScroll();

    return () => {
      tableElement?.removeEventListener("scroll", checkScroll);
    };
  }, [assignments]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (sortedAssignments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900">
          No assignments found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by accepting new assignments from the coordinator.
        </p>
      </div>
    );
  }

  const SortableHeader = ({
    column,
    children,
  }: {
    column: SortColumn;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="sticky top-0 z-10 bg-white cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {children}
        {sortConfig.column === column ? (
          sortConfig.direction === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="relative h-full">
      <div ref={tableRef} className="overflow-y-auto scrollbar-hide h-full">
        <Table className="border-separate border-spacing-0 w-full">
          <TableHeader className="[&_tr]:hover:bg-transparent">
            <TableRow>
              <SortableHeader column="id">No</SortableHeader>
              <SortableHeader column="request">Request</SortableHeader>
              <SortableHeader column="disaster">Disaster</SortableHeader>
              <SortableHeader column="priority">Priority</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="assignedAt">Assigned</SortableHeader>
              <TableHead className="w-[150px] text-right sticky top-0 z-10 bg-white">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssignments.map((assignment,index) => (
              <TableRow
                key={assignment.id}
                className={cn(
                  "hover:bg-gray-50 transition-colors cursor-pointer",
                  selectedAssignmentId === assignment.id &&
                    "bg-blue-50 hover:bg-blue-50"
                )}
                onClick={(e) => {
                  if (
                    !(e.target instanceof HTMLElement) ||
                    !(e.target.closest("button") || e.target.closest("a"))
                  ) {
                    onViewDetails(assignment);
                  }
                }}
              >
                <TableCell
                  className={cn(
                    "font-medium border-t",
                    selectedAssignmentId === assignment.id && "border-blue-200"
                  )}
                >
                  {index + 1}{" "}
                  {/* ✅ Auto increment row number starting from 1 */}
                </TableCell>
                <TableCell
                  className={cn(
                    "border-t",
                    selectedAssignmentId === assignment.id && "border-blue-200"
                  )}
                >
                  <div className="font-medium">
                    {assignment.requestDetails.supportType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {assignment.requestDetails.quantity}{" "}
                    {assignment.requestDetails.unit}
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    "border-t",
                    selectedAssignmentId === assignment.id && "border-blue-200"
                  )}
                >
                  {assignment.requestDetails.disasterEventName}
                </TableCell>
                <TableCell
                  className={cn(
                    "border-t",
                    selectedAssignmentId === assignment.id && "border-blue-200"
                  )}
                >
                  <RequestPriorityBadge priority={assignment.priority} />
                </TableCell>
                <TableCell
                  className={cn(
                    "border-t",
                    selectedAssignmentId === assignment.id && "border-blue-200"
                  )}
                >
                  <AssignmentStatusBadge status={assignment.status} />
                </TableCell>
                <TableCell
                  className={cn(
                    "border-t",
                    selectedAssignmentId === assignment.id && "border-blue-200"
                  )}
                >
                  <div className="text-sm">
                    {new Date(assignment.assignedAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right border-t",
                    selectedAssignmentId === assignment.id && "border-blue-200"
                  )}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(assignment);
                      }}
                      className={cn(
                        "text-gray-600 hover:text-gray-900",
                        selectedAssignmentId === assignment.id &&
                          "text-blue-600 hover:text-blue-700"
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AssignmentStatusActions
                      assignment={assignment}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showScrollShadow && (
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
};
