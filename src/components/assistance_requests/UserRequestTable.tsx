// UserRequestsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';
import type { AssistanceRequest } from '@/types/assistanceRequests';
import { RequestPriorityBadge } from '@/components/assistance_requests/RequestPriorityBadge';
import { RequestStatusBadge } from '@/components/assistance_requests/RequestStatusBadge';

interface UserRequestsTableProps {
  requests: AssistanceRequest[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}

export const UserRequestsTable = ({
  requests,
  loading,
  onEdit,
  onDelete,
}: UserRequestsTableProps) => {
  const canEditOrDelete = (status: string) => status === 'Pending';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>DisasterName</TableHead>
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
            <TableCell className="font-medium">{request.disasterEventName}</TableCell>
            
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{request.supportType}</span>
                <span className="text-sm text-muted-foreground">
                  {request.description}
                </span>
              </div>
            </TableCell>
             <TableCell className="font-medium">{request.quantity}{request.unit}</TableCell>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(request.id)}
                  disabled={loading || !canEditOrDelete(request.status)}
                >
                  <PenLine className="h-4 w-4 mr-2" />
                  
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(request.id)}
                  disabled={loading || !canEditOrDelete(request.status)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};