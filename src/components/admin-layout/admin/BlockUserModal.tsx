import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // ✅ Use sonner's toast directly
import useUserStore from "@/store/userStore";

interface BlockUserModalProps {
  userId: string;
  userName: string;
  currentStatus: "Active" | "Blacklisted";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BlockUserModal({
  userId,
  userName,
  currentStatus,
  open,
  onOpenChange,
  onSuccess,
}: BlockUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toggleBlockUser } = useUserStore();

  const isBlocking = currentStatus === "Active";
  const actionText = isBlocking ? "Block" : "Unblock";

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await toggleBlockUser(userId, currentStatus);
      toast.success(
        `User ${userName} has been ${
          isBlocking ? "blocked" : "unblocked"
        } successfully.`
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update user status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <DialogTitle>
              {actionText} User: {userName}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isBlocking
              ? "This user will lose access to the system. Are you sure you want to block them?"
              : "This user will regain access to the system. Are you sure you want to unblock them?"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={isBlocking ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
