// src/pages/admin/AssignRequestPage/AssignRequestPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssignmentStore } from "@/store/RequestAssignmentStore";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
import { toast } from "sonner";
import { RequestSummaryCard } from "@/components/assignments/RequestsSummaryCard";
import { TeamSelectionGrid } from "@/components/assignments/TeamSelectionGrid";
import { getRequestById } from "@/api/assistanceRequests";

const formSchema = z.object({
  reliefTeamId: z.number().min(1, "Please select a relief team"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  notes: z.string().optional(),
});

export const AssignRequestsToReliefPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createAssignment } = useAssignmentStore();

  // State for request data, loading, and error
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setIsLoading(true);
        const requestData = await getRequestById(Number(id));
        setRequest(requestData);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch request");
        console.error("Error fetching request:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "Medium",
    },
  });

  const handleAssign = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!request) return;
      
      await createAssignment({
        assistanceRequestId: request.id,
        ...data
      });
      
      toast.success("Assignment Successful", {
        description: "The request has been assigned to the relief team",
      });
      
      navigate("/admin/requests");
    } catch (err) {
      toast.error("Assignment Failed", {
        description: "There was an error assigning the request",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Request not found</h2>
        <p className="text-muted-foreground">
          {error || "The request you're trying to access doesn't exist"}
        </p>
        <Button onClick={() => navigate("/admin/requests")}>
          Back to Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/admin/requests")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Assign Assistance Request</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Summary */}
        <div className="lg:col-span-1 space-y-6">
          <RequestSummaryCard request={request} />
        </div>

        {/* Right Column - Assignment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAssign)} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select Relief Team</h2>
                  <FormField
                    control={form.control}
                    name="reliefTeamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TeamSelectionGrid
                            selectedTeamId={field.value}
                            onTeamSelect={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <h2 className="text-xl font-semibold pt-4">Assignment Details</h2>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block mb-2">Priority Level</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-4 gap-2">
                            {(["Low", "Medium", "High", "Critical"] as const).map((priority) => (
                              <button
                                type="button"
                                key={priority}
                                className={`border rounded-md p-3 text-center transition-colors flex flex-col items-center gap-2 ${
                                  field.value === priority
                                    ? "border-primary bg-primary/10"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => field.onChange(priority)}
                              >
                                <RequestPriorityBadge priority={priority} />
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignment Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any special instructions for the relief team..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate("/admin/requests")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      "Assign Request"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};