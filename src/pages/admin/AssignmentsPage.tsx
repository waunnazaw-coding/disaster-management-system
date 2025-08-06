// src/pages/admin/AdminAssignmentsPage.tsx
import { AdminAssignmentsTable } from "@/components/assignments/AdminAssignmentsTable";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatusFilter } from "@/components/shared/StatusFilter";
import { useAssignmentStore } from "@/store/RequestAssignmentStore";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const AdminAssignmentsPage = () => {
  const { assignments, loading, fetchAssignments } = useAssignmentStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = assignments.filter(assignment => {
    const statusMatch = statusFilter === "all" || assignment.status === statusFilter;
    const searchMatch = 
      assignment.id.toString().includes(searchQuery) ||
      assignment.requestDetails.supportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.requestDetails.disasterEventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.reliefTeamName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Request Assignments</h1>
          <p className="text-sm text-gray-500">
            View and manage all assignment requests
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
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
          <Button 
            onClick={() => navigate("/admin/requests")}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminAssignmentsTable
            assignments={filteredAssignments}
            loading={loading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};