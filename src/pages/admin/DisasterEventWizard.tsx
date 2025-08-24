"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DisasterEventForm from "./DisasterEventForm";
import ImpactForm from "./ImpactForm";

export default function DisasterEventWizard() {
  const [mode, setMode] = useState<"none" | "occurrence" | "impact">("none");

  const reset = () => setMode("none");

  return (
    <div className="py-10 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl p-6">
        {mode === "none" && (
          <div className="py-40 p-6 rounded h-20">
            <h1 className="text-2xl font-bold mb-12 text-center">
              Choose Survey for Reporting Disaster
            </h1>
            <div className="flex gap-4">
              <Button
                onClick={() => setMode("occurrence")}
                className="flex-1"
              >
                Disaster Occurrence
              </Button>
              <Button
                onClick={() => setMode("impact")}
                className="flex-1"
                variant="outline"
              >
                Disaster Impact
              </Button>
            </div>
          </div>
        )}

        {mode === "occurrence" && (
          <DisasterEventForm onCancel={reset} onSuccess={reset} />
        )}
        {mode === "impact" && (
          <ImpactForm onCancel={reset} onSuccess={reset} />
        )}
      </div>
    </div>
  );
}
