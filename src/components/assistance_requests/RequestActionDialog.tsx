// src/components/assistance_requests/RequestActionDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

// Define possible button variants based on ShadCN's Button component
type ButtonVariant =
  | "default"
  | "link"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";

interface RequestActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "approve" | "reject" | "fulfill";
  requestId: number;
  requestDetails?: {
    userName: string | null;
    supportType: string;
    quantity: number | null;
    unit: string | null;
  };
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export const RequestActionDialog = ({
  open,
  onOpenChange,
  action,

  requestDetails,
  onConfirm,
  loading,
}: RequestActionDialogProps) => {
  const actionTitles = {
    approve: "Approve Request",
    reject: "Reject Request",
    fulfill: "Mark as Fulfilled",
  };

  const actionDescriptions = {
    approve:
      "This will approve the assistance request and notify the requester.",
    reject: "This will reject the assistance request and notify the requester.",
    fulfill:
      "This will mark the request as fulfilled. Please ensure the assistance has been provided.",
  };

  const actionButtonText = {
    approve: loading ? "Approving..." : "Approve",
    reject: loading ? "Rejecting..." : "Reject",
    fulfill: loading ? "Fulfilling..." : "Fulfill",
  };

  // Properly typed button variants
  const actionButtonVariant: Record<
    "approve" | "reject" | "fulfill",
    ButtonVariant
  > = {
    approve: "default",
    reject: "destructive",
    fulfill: "default",
  };

  // Helper function to handle null/undefined values
  const getDisplayValue = (
    value: string | null | undefined,
    fallback = "N/A"
  ) => {
    return value ?? fallback;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{actionTitles[action]}</DialogTitle>
          <DialogDescription>{actionDescriptions[action]}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Request Details</p>
            {requestDetails && (
              <div className="bg-muted/50 p-4 rounded-md text-sm">
                <p>
                  <span className="font-medium">Requester:</span>{" "}
                  {getDisplayValue(requestDetails.userName)}
                </p>
                <p>
                  <span className="font-medium">Support Type:</span>{" "}
                  {requestDetails.supportType}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span>{" "}
                  {getDisplayValue(requestDetails.quantity?.toString())}{" "}
                  {getDisplayValue(requestDetails.unit)}
                </p>
              </div>
            )}
          </div>

          {action === "reject" && (
            <div className="space-y-2">
              {/* <p className="text-sm font-medium">
                Reason for rejection (optional)
              </p>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                placeholder="Provide reason for rejection..."
              /> */}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={actionButtonVariant[action]}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {actionButtonText[action]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
