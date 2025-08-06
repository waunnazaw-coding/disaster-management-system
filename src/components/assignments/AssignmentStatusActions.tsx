
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestAssignment } from "@/types/requestAssignments";
import { MoreHorizontal, Check, Truck, X } from "lucide-react";

interface AssignmentStatusActionsProps {
  assignment: RequestAssignment;
  onStatusChange: (id: number, status: string) => Promise<void>;
}

export const AssignmentStatusActions = ({
  assignment,
  onStatusChange,
}: AssignmentStatusActionsProps) => {
  const handleStatusUpdate = async (status: string) => {
    try {
      await onStatusChange(assignment.id, status);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusUpdate('InProgress')}
          disabled={assignment.status !== 'Assigned'}
        >
          <Check className="mr-2 h-4 w-4 text-blue-600" />
          Start Progress
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate('Done')}
          disabled={assignment.status !== 'InProgress'}
        >
          <Truck className="mr-2 h-4 w-4 text-green-600" />
          Mark Complete
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate('Cancelled')}
          disabled={assignment.status === 'Done' || assignment.status === 'Cancelled'}
        >
          <X className="mr-2 h-4 w-4 text-red-600" />
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};