// src/components/assignments/AdminAssignmentsTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { AssignmentStatusBadge } from "./AssignmentStatusBadge";
import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { AssignmentDetailsModal } from "./AssignDetailsModal";
import type { RequestAssignment } from "@/types/requestAssignments";
import { cn } from "@/lib/utils";

type SortKey = 'id' | 'priority' | 'status' | 'assignedAt';

export const AdminAssignmentsTable = ({
  assignments,
  loading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: {
  assignments: RequestAssignment[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'assignedAt',
    direction: 'desc',
  });
  const [selectedAssignment, setSelectedAssignment] = useState<RequestAssignment | null>(null);

  // Sorting logic
  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const totalItems = sortedAssignments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAssignments.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main table content */}
      <div className={`space-y-6 ${selectedAssignment ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
        <div className="relative">
          {/* Items per page selector at the top */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  onItemsPerPageChange(Number(e.target.value));
                  onPageChange(1);
                }}
                className="border rounded-md px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                    <div className="flex items-center">
                      ID 
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead> */}
                  <TableHead>Request</TableHead>
                  <TableHead>Disaster</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead onClick={() => handleSort('priority')} className="cursor-pointer">
                    <div className="flex items-center">
                      Priority
                      {sortConfig.key === 'priority' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('assignedAt')} className="cursor-pointer">
                    <div className="flex items-center">
                      Assigned
                      {sortConfig.key === 'assignedAt' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((assignment) => (
                  <TableRow 
                    key={assignment.id} 
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      selectedAssignment?.id === assignment.id && "bg-blue-50 hover:bg-blue-50"
                    )}
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    {/* <TableCell>#{assignment.id}</TableCell> */}
                    <TableCell>
                      <div className="font-medium">{assignment.requestDetails.supportType}</div>
                      <div className="text-sm text-gray-500">
                        {assignment.requestDetails.quantity} {assignment.requestDetails.unit}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.requestDetails.disasterEventName}</TableCell>
                    <TableCell>{assignment.reliefTeamName}</TableCell>
                    <TableCell>
                      <RequestPriorityBadge priority={assignment.priority} />
                    </TableCell>
                    <TableCell>
                      <AssignmentStatusBadge status={assignment.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssignment(assignment);
                        }}
                        className={cn(
                          "text-gray-600 hover:text-gray-900",
                          selectedAssignment?.id === assignment.id && "text-blue-600 hover:text-blue-700"
                        )}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls at the bottom */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} assignments
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details panel - appears on the right side when assignment is selected */}
      {selectedAssignment && (
        <div className="lg:col-span-1 h-full">
          <AssignmentDetailsModal
            assignment={selectedAssignment}
            onClose={() => setSelectedAssignment(null)}
            isActive={true}
          />
        </div>
      )}
    </div>
  );
};