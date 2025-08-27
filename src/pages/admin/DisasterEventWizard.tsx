"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, ArrowRight, Zap } from "lucide-react";
import DisasterEventForm from "./DisasterEventForm";
import ImpactForm from "./ImpactForm";

export default function DisasterEventWizard() {
  const [mode, setMode] = useState<"none" | "occurrence" | "impact">("none");

  const reset = () => setMode("none");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {mode === "none" && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center text-white">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-3">
                Disaster Event Maintaining System
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
               Choose the type of Event you'd like to create.
              </p>
            </div>

            {/* Content Section */}
            <div className="px-8 py-12">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* Disaster Occurrence Card */}
                <div 
                  className="group relative bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border-2 border-red-100 hover:border-red-300 transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:-translate-y-1"
                  onClick={() => setMode("occurrence")}
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-red-500" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <Zap className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Disaster Occurrence
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Create a New disaster event happening in areas. This includes natural disasters, emergencies, or any catastrophic events requiring immediate attention.
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                      Event details and location
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                      Severity assessment
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                      Emergency contact information
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMode("occurrence");
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Create New Disaster
                  </Button>
                </div>

                {/* Disaster Impact Card */}
                <div 
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:-translate-y-1"
                  onClick={() => setMode("impact")}
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Disaster Impact
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Document the effects and consequences of an existing disaster event. Help us understand the scope of damage and required resources for recovery.
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      Damage assessment
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      Affected populations
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      Economic and infrastructure losses
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMode("impact");
                    }}
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Create Impact Details of Disaster
                  </Button>
                </div>

              </div>
              
              {/* Footer Info */}
              <div className="mt-12 text-center">
                <p className="text-gray-500 text-sm">
                  Your efforts help emergency responders and authorities coordinate effective disaster response and recovery efforts.
                </p>
              </div>
            </div>
          </div>
        )}

        {mode === "occurrence" && (
          <div className="">
            <DisasterEventForm onCancel={reset} onSuccess={reset} />
          </div>
        )}
        
        {mode === "impact" && (
          <div className="">
            <ImpactForm onCancel={reset} onSuccess={reset} />
          </div>
        )}
      </div>
    </div>
  );
}