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

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

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

const actionConfig = {
  approve: {
    title: "Approve Request",
    description:
      "This will approve the assistance request and notify the requester.",
    buttonText: "Approve",
    loadingText: "Approving...",
    variant: "default" as ButtonVariant,
  },
  reject: {
    title: "Reject Request",
    description:
      "This will reject the assistance request and notify the requester.",
    buttonText: "Reject",
    loadingText: "Rejecting...",
    variant: "destructive" as ButtonVariant,
  },
  fulfill: {
    title: "Mark as Fulfilled",
    description:
      "This will mark the request as fulfilled. Please ensure the assistance has been provided.",
    buttonText: "Fulfill",
    loadingText: "Fulfilling...",
    variant: "default" as ButtonVariant,
  },
};

export const RequestActionDialog = ({
  open,
  onOpenChange,
  action,
  requestDetails,
  onConfirm,
  loading,
}: RequestActionDialogProps) => {
  const config = actionConfig[action];

  const getDisplayValue = (
    value: string | number | null | undefined,
    fallback = "N/A"
  ) => {
    if (value === null || value === undefined) return fallback;
    return typeof value === "number" ? value.toString() : value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Request Details</p>
            {requestDetails && (
              <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2">
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
                  {getDisplayValue(requestDetails.quantity)}{" "}
                  {getDisplayValue(requestDetails.unit)}
                </p>
              </div>
            )}
          </div>
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
            variant={config.variant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? config.loadingText : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
