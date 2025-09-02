"use client";

import React, { useEffect, useState } from "react";
import { getAllImpacts, Impact, updateImpactStatus } from "@/api/ImpactApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PendingImpactsSidebar() {
    const [impacts, setImpacts] = useState<Impact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchImpacts() {
            try {
                const data = await getAllImpacts();
                setImpacts(data.filter((i) => i.status === "Pending")); // show only pending
            } catch {
                toast.error("Failed to load pending impacts");
            } finally {
                setLoading(false);
            }
        }
        fetchImpacts();
    }, []);

    const handleAction = async (impactId: number) => {
        try {
            await updateImpactStatus(impactId, "Done"); // always "Done"
            setImpacts((prev) => prev.filter((i) => i.id !== impactId)); // remove from list
            toast.success("Impact marked as done successfully");
        } catch (error) {
            toast.error("Failed to update impact");
            console.error(error);
        }
    };


    if (loading) return <p className="p-4 text-gray-500">Loading pending impacts...</p>;

    if (impacts.length === 0) {
        return <p className="p-4 text-gray-400 text-sm">No pending impacts</p>;
    }

    return (
        <div className="w-80 h-180 overflow-y-auto bg-white border-l shadow-lg p-4">
            <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold mb-1">Pending Impacts</h2>
                <p className="text-sm font-bold text-white bg-green-500 text-center pt-1 w-7 h-7 rounded-full">
                    {impacts.length}
                </p>
            </div>
            <div className="space-y-3">
                {impacts.map((impact) => (
                    <Card key={impact.id} className="shadow-sm">
                        <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{impact.type}</span>
                                <Badge className="bg-yellow-500">{impact.status}</Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 break-words">
                                <span>
                                    {impact.objectName ? `${impact.objectName}` : "No ObjectName Provided"}
                                </span>
                                <span className="break-words">
                                    {impact.value ? ` - ${impact.value}` : ""}
                                </span>
                            </p>
                            {impact.relatedReport && (
                                <p className="text-[11px] font-bold text-black mt-1">Related Report: {impact.relatedReport}</p>
                            )}
                            {impact.relatedEvent && (
                                <p className="text-[11px] text-gray-400">Related Event: {impact.relatedEvent}</p>
                            )}
                            {/* Action button */}
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => handleAction(impact.id)}
                                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Done
                                </button>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
