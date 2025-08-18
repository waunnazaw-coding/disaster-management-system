// src/pages/relief/ReliefAssignmentsPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusFilter } from "@/components/shared/StatusFilter";
import { useState } from "react";
import { useAssignmentStore } from "@/store/RequestAssignmentStore";
import { useReliefStore } from "@/store/reliefStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestAssignment } from "@/types/requestAssignments";
import { ReliefAssignmentsTable } from "@/components/assignments/ReliefTeamAssignmentsTable";
import { AssignmentDetailsModal } from "@/components/assignments/AssignDetailsModal";

export const ReliefAssignmentsPage = () => {
  const { reliefTeamId,currentUser } = useReliefStore();
  const { 
    assignments, 
    loading, 
    fetchTeamAssignments,
    updateStatus 
  } = useAssignmentStore();
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<RequestAssignment | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  console.log("CureentUser=",currentUser);
     console.log("ReliefTeamId=",reliefTeamId);

  useEffect(() => {
    if (reliefTeamId) {
    
      fetchTeamAssignments(reliefTeamId);
    }
  }, [reliefTeamId, fetchTeamAssignments]);

  const filteredAssignments = assignments.filter(assignment => {
    // Status filter
    const statusMatch = statusFilter === "all" || assignment.status === statusFilter;
    
    // Search filter
    const searchMatch = 
      assignment.id.toString().includes(searchQuery) ||
      assignment.requestDetails.supportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.requestDetails.disasterEventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.reliefTeamName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Pagination logic
  const totalItems = filteredAssignments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus(id, { status });
      toast.success("Assignment status updated successfully");
      if (reliefTeamId) {
        await fetchTeamAssignments(reliefTeamId);
      }
      if (selectedAssignment && selectedAssignment.id === id) {
        setSelectedAssignment({
          ...selectedAssignment,
          status
        });
      }
    } catch (error) {
      toast.error("Failed to update assignment status");
      console.error("Status update error:", error);
    }
  };

  const handleViewDetails = (assignment: RequestAssignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseDetails = () => {
    setSelectedAssignment(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main content */}
      <div className={`space-y-6 ${selectedAssignment ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Assignments</h1>
            <p className="text-sm text-gray-500">
              Manage and track your team's relief assignments
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <StatusFilter 
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Assigned", label: "Assigned" },
                { value: "InProgress", label: "In Progress" },
                { value: "Done", label: "Completed" },
                { value: "Cancelled", label: "Cancelled" },
              ]}
            />
          </div>
        </div>

         <Card className="h-[calc(100vh-180px)] overflow-hidden flex flex-col group">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>
                {totalItems} Assignment{totalItems !== 1 ? 's' : ''}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Items per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
         <CardContent className="p-0 flex-1 overflow-auto scrollbar-hide scroll-fade relative">
            <ReliefAssignmentsTable
              assignments={currentItems}
              loading={loading}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              selectedAssignmentId={selectedAssignment?.id}
            />
            {/* Scroll indicator (only visible when content is scrollable) */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardContent>
          {totalPages > 1 && (
            <div className="border-t px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} assignments
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
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
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Details panel */}
      {selectedAssignment && (
        <div className="lg:col-span-1 h-[calc(100vh-120px)] overflow-hidden group">
          <AssignmentDetailsModal
            assignment={selectedAssignment}
            onClose={handleCloseDetails}
            onStatusChange={handleStatusChange}
            isActive={true}
          />
          {/* Scroll indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
};