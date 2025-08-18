// components/SuccessModal.tsx
"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

export default function SuccessModal({
  open,
  title = "Success!",
  message = "Your submission was successful.",
  onClose
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center mb-3">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div className="flex justify-center mb-2">
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="indent-6">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center">
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
