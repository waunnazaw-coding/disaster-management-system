// UserRequestsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, PenLine, Trash2 } from "lucide-react";
import type { AssistanceRequest } from "@/types/assistanceRequests";
import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
import { RequestStatusBadge } from "@/components/assistance_requests/RequestStatusBadge";

interface UserRequestsTableProps {
  requests: AssistanceRequest[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
  onView: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const UserRequestsTable = ({
  requests,
  loading,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  onPageChange,
}: UserRequestsTableProps) => {
  const canEditOrDelete = (status: string) => status === "Pending";

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Disaster Name</TableHead>
            <TableHead>Support Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">#{request.id}</TableCell>
              <TableCell className="font-medium">
                {request.disasterEventName}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{request.supportType}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {request.quantity}
                {request.unit}
              </TableCell>
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
                <div className="flex gap-2">
                  {/* View Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(request.id)}
                    disabled={loading}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(request.id)}
                    disabled={loading || !canEditOrDelete(request.status)}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(request.id)}
                    disabled={loading || !canEditOrDelete(request.status)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
