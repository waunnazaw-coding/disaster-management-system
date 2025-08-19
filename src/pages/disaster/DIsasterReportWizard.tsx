"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DisasterReportForm from "./DisasterReportForm";
import ImpactFormForUsers from "./ImpactFormForUsers";

export default function DisasterReportWizard() {
  const [mode, setMode] = useState<"none" | "occurrence" | "impact">("none");

  const reset = () => setMode("none");

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        {mode === "none" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">
              Choose Survey for Reporting Disaster
            </h1>
            <div className="flex gap-4">
              <Button
                onClick={() => setMode("occurrence")}
                className="flex-1"
              >
                Disaster Occurrence Report
              </Button>
              <Button
                onClick={() => setMode("impact")}
                className="flex-1"
                variant="outline"
              >
                Related disaster Impact
              </Button>
            </div>
          </>
        )}

        {mode === "occurrence" && (
          <DisasterReportForm onCancel={reset} onSuccess={reset} />
        )}
        {mode === "impact" && (
          <ImpactFormForUsers onCancel={reset} onSuccess={reset} />
        )}
      </div>
    </div>
  );
}
