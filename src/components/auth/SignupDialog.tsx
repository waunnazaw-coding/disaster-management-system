// SignupDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {SignUpForm} from "@/components/auth/SignUpForm";

export default function SignupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create new account</DialogTitle>
        </DialogHeader>
        <SignUpForm />
      </DialogContent>
    </Dialog>
  );
}