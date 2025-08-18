// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { AssignRequestForm } from "./AssignRequestForm";
// import type { AssistanceRequest } from "@/types/assistanceRequests";
// import { useAssignmentStore } from "@/store/RequestAssignmentStore";
// import { Separator } from "@/components/ui/separator";
// import { RequestPriorityBadge } from "../assistance_requests/RequestPriorityBadge";
// import { RequestStatusBadge } from "../assistance_requests/RequestStatusBadge";
// import { Skeleton } from "@/components/ui/skeleton";

// export const AssignRequestDialog = ({
//   request,
//   open,
//   onOpenChange,
// }: {
//   request: AssistanceRequest | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) => {
//   const { createAssignment } = useAssignmentStore();

//   const handleAssign = async (data: {
//     reliefTeamId: number;
//     priority: 'Low' | 'Medium' | 'High' | 'Critical';
//     notes?: string;
//   }) => {
//     if (!request) return;
    
//     await createAssignment({
//       assistanceRequestId: request.id,
//       ...data
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Assign Request to Team</DialogTitle>
//         </DialogHeader>
        
//         {request ? (
//           <div className="space-y-4">
//             {/* Request Details Section */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Request ID</h4>
//                 <p className="font-medium">#{request.id}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Disaster</h4>
//                 <p>{request.disasterEventName || "N/A"}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Requester</h4>
//                 <p>{request.userName}</p>
//                 <p className="text-sm text-muted-foreground">{request.contactPhone}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Support Type</h4>
//                 <p>{request.supportType}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Quantity</h4>
//                 <p>{request.quantity} {request.unit}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
//                 <p className="line-clamp-2">{request.detailedAddress}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Priority</h4>
//                 <RequestPriorityBadge priority={request.priority as any} />
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
//                 <RequestStatusBadge status={request.status as any} />
//               </div>
//             </div>
            
//             <Separator />
            
//             {/* Assignment Form */}
//             <AssignRequestForm 
//               request={request}
//               onSubmit={handleAssign}
//               loading={false}
//             />
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-full" />
//             <div className="grid grid-cols-2 gap-4">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <div key={i} className="space-y-2">
//                   <Skeleton className="h-4 w-1/2" />
//                   <Skeleton className="h-6 w-full" />
//                 </div>
//               ))}
//             </div>
//             <Separator />
//             <Skeleton className="h-64 w-full" />
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };


// src/components/assignments/AssignRequestDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AssignRequestForm } from "./AssignRequestForm";
import type { AssistanceRequest } from "@/types/assistanceRequests";
import { useAssignmentStore } from "@/store/RequestAssignmentStore";
import { Separator } from "@/components/ui/separator";
import { RequestPriorityBadge } from "../assistance_requests/RequestPriorityBadge";
import { RequestStatusBadge } from "../assistance_requests/RequestStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

export const AssignRequestDialog = ({
  request,
  open,
  onOpenChange,
}: {
  request: AssistanceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { createAssignment } = useAssignmentStore();

  const handleAssign = async (data: {
    reliefTeamId: number;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    notes?: string;
  }) => {
    if (!request) return;
    
    await createAssignment({
      assistanceRequestId: request.id,
      ...data
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign Assistance Request</DialogTitle>
          <p className="text-sm text-muted-foreground">{request?.disasterEventName}</p>
        </DialogHeader>
        
        {request ? (
          <div className="space-y-4">
            {/* Request Summary Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Request ID</h4>
                  <p className="font-medium">#{request.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <RequestStatusBadge status={request.status as any} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Current Priority</h4>
                  <RequestPriorityBadge priority={request.priority as any} />
                </div>
              </div>
            </div>

            <Separator />
            
            {/* Assignment Form */}
            <AssignRequestForm 
              request={request}
              onSubmit={handleAssign}
              loading={false}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
            <Separator />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};