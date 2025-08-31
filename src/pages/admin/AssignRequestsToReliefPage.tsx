
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAssignmentStore } from "@/store/RequestAssignmentStore";
// import { Button } from "@/components/ui/button";
// import { Loader2, ArrowLeft, AlertCircle, Info, ChevronRight } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { RequestSummaryCard } from "@/components/assignments/RequestsSummaryCard";
// import { TeamSelectionGrid } from "@/components/assignments/TeamSelectionGrid";
// import { getRequestById } from "@/api/assistanceRequests";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { PriorityIndicator } from "@/components/shared/PriorityIndicator";

// const formSchema = z.object({
//   reliefTeamId: z.number().min(1, "Please select a relief team"),
//   priority: z.enum(["Low", "Medium", "High", "Critical"]),
//   notes: z.string().optional(),
// });

// export const AssignRequestsToReliefPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { createAssignment } = useAssignmentStore();

//   const [request, setRequest] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("teams");

//   useEffect(() => {
//     const fetchRequest = async () => {
//       try {
//         setIsLoading(true);
//         const requestData = await getRequestById(Number(id));
//         setRequest(requestData);
//         setError(null);
//       } catch (err) {
//         setError(err.message || "Failed to fetch request");
//         console.error("Error fetching request:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRequest();
//   }, [id]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       priority: "Medium",
//       notes: ""
//     },
//   });

//   const handleAssign = async (data: z.infer<typeof formSchema>) => {
//     try {
//       if (!request) return;
      
//       await createAssignment({
//         assistanceRequestId: request.id,
//         ...data
//       });
      
//       toast.success("Assignment Successful", {
//         description: "The request has been assigned to the relief team",
//       });
      
//       navigate("/admin/assignments");
//     } catch (err) {
//       toast.error("Assignment Failed", {
//         description: err.message || "There was an error assigning the request",
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-4">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <p className="text-lg text-muted-foreground">Loading request details...</p>
//       </div>
//     );
//   }

//   if (error || !request) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
//         <div className="bg-red-100 p-4 rounded-full">
//           <AlertCircle className="h-12 w-12 text-red-600" />
//         </div>
//         <h2 className="text-2xl font-bold text-foreground">Request Not Found</h2>
//         <p className="text-muted-foreground text-center max-w-md">
//           {error || "The request you're trying to access doesn't exist or may have been removed."}
//         </p>
//         <div className="flex gap-3 mt-4">
//           <Button variant="outline" onClick={() => navigate("/admin/assignments")}>
//             Back to Assignments
//           </Button>
//           <Button onClick={() => window.location.reload()}>
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <div className="flex flex-col gap-6">
//         {/* Header with Breadcrumb */}
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <button 
//               onClick={() => navigate("/admin/assignments")}
//               className="hover:text-primary transition-colors"
//             >
//               Assignments
//             </button>
//             <ChevronRight className="h-4 w-4" />
//             <span>Assign Request</span>
//           </div>
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button 
//                 variant="outline" 
//                 size="icon" 
//                 onClick={() => navigate("/admin/assignments")}
//                 className="rounded-lg"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </Button>
//               <h1 className="text-2xl md:text-3xl font-bold text-foreground">Assign Assistance Request</h1>
//             </div>
//             <Badge variant="outline" className="text-sm py-1 px-3">
//               ID: {request.id}
//             </Badge>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Left Column - Request Summary */}
//           <div className="lg:col-span-1">
//             <Card className="h-full">
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Info className="h-5 w-5 text-primary" />
//                   <span>Request Overview</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <RequestSummaryCard request={request} />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Assignment Form */}
//           <div className="lg:col-span-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Assignment Details</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Form {...form}>
//                   <form onSubmit={form.handleSubmit(handleAssign)} className="space-y-8">
//                     {/* Team Selection Tabs */}
//                     <div className="space-y-6">
//                       <div>
//                         <h2 className="text-xl font-semibold mb-4">Select Relief Team</h2>
                        
//                         <Tabs 
//                           value={activeTab} 
//                           onValueChange={setActiveTab}
//                           className="space-y-6"
//                         >
//                           <TabsList className="grid grid-cols-2 w-full max-w-xs">
//                             <TabsTrigger value="teams">Available Teams</TabsTrigger>
//                             <TabsTrigger value="recent">Recently Used</TabsTrigger>
//                           </TabsList>
                          
//                           <TabsContent value="teams">
//                             <FormField
//                               control={form.control}
//                               name="reliefTeamId"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormControl>
//                                     <TeamSelectionGrid
//                                       selectedTeamId={field.value}
//                                       onTeamSelect={field.onChange}
//                                     />
//                                   </FormControl>
//                                   <FormMessage className="mt-2" />
//                                 </FormItem>
//                               )}
//                             />
//                           </TabsContent>
                          
//                           <TabsContent value="recent">
//                             <div className="border rounded-lg p-6 text-center bg-muted/30">
//                               <div className="flex flex-col items-center justify-center gap-3 min-h-[200px]">
//                                 <Info className="h-8 w-8 text-muted-foreground" />
//                                 <h3 className="font-medium text-lg">Recent Teams</h3>
//                                 <p className="text-muted-foreground max-w-md">
//                                   Your recently used relief teams will appear here once you start making assignments.
//                                 </p>
//                               </div>
//                             </div>
//                           </TabsContent>
//                         </Tabs>
//                       </div>
                      
//                       {/* Assignment Details */}
//                       <div className="pt-4 border-t">
//                         <h2 className="text-xl font-semibold mb-4">Assignment Configuration</h2>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <FormField
//                             control={form.control}
//                             name="priority"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel className="block mb-3 font-medium">Priority Level</FormLabel>
//                                 <FormControl>
//                                   <div className="grid grid-cols-2 gap-3">
//                                     {(["Low", "Medium", "High", "Critical"] as const).map((priority) => (
//                                       <button
//                                         type="button"
//                                         key={priority}
//                                         className={`flex items-center gap-3 border rounded-lg p-4 transition-all ${
//                                           field.value === priority
//                                             ? "border-primary bg-primary/5 ring-1 ring-primary"
//                                             : "hover:bg-muted/50"
//                                         }`}
//                                         onClick={() => field.onChange(priority)}
//                                       >
//                                         <PriorityIndicator priority={priority} />
//                                         <span className="font-medium">{priority}</span>
//                                       </button>
//                                     ))}
//                                   </div>
//                                 </FormControl>
//                                 <FormMessage className="mt-2" />
//                               </FormItem>
//                             )}
//                           />
                          
//                           <FormField
//                             control={form.control}
//                             name="notes"
//                             render={({ field }) => (
//                               <FormItem className="h-full">
//                                 <FormLabel className="font-medium">Assignment Notes</FormLabel>
//                                 <FormControl>
//                                   <Textarea
//                                     placeholder="Add any special instructions for the relief team..."
//                                     className="min-h-[150px]"
//                                     {...field}
//                                   />
//                                 </FormControl>
//                                 <FormMessage />
//                                 <p className="text-sm text-muted-foreground mt-2">
//                                   These notes will be visible to the relief team
//                                 </p>
//                               </FormItem>
//                             )}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex justify-end gap-3 pt-4 border-t">
//                       <Button 
//                         variant="outline" 
//                         type="button"
//                         onClick={() => navigate("/admin/assignments")}
//                         className="min-w-[120px]"
//                       >
//                         Cancel
//                       </Button>
//                       <Button 
//                         type="submit" 
//                         disabled={form.formState.isSubmitting}
//                         className="min-w-[160px]"
//                       >
//                         {form.formState.isSubmitting ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Assigning...
//                           </>
//                         ) : (
//                           "Confirm Assignment"
//                         )}
//                       </Button>
//                     </div>
//                   </form>
//                 </Form>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// src/pages/admin/AssignRequestPage/AssignRequestPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssignmentStore } from "@/store/RequestAssignmentStore";
import { useRecentTeamsStore } from "@/store/RecentTeamsStore";
import { useReliefTeams } from "@/hooks/useReliefTeams";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, AlertCircle, Info, ChevronRight, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RequestSummaryCard } from "@/components/assignments/RequestsSummaryCard";
import { TeamSelectionGrid } from "@/components/assignments/TeamSelectionGrid";
import { getRequestById } from "@/api/assistanceRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriorityIndicator } from "@/components/shared/PriorityIndicator";

const formSchema = z.object({
  reliefTeamId: z.number().min(1, "Please select a relief team"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  notes: z.string().optional(),
});

export const AssignRequestsToReliefPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createAssignment } = useAssignmentStore();
  const { recentTeams } = useRecentTeamsStore();
  const { reliefTeams, loading: teamsLoading, error: teamsError } = useReliefTeams();

  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("teams");

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
      notes: ""
    },
  });

  const handleAssign = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!request) return;
      
      // Find the team to add to recent teams
      const team = reliefTeams.find(t => t.id === data.reliefTeamId);
      if (team) {
        useRecentTeamsStore.getState().addRecentTeam({
          id: team.id,
          name: team.name
        });
      }
      
      await createAssignment({
        assistanceRequestId: request.id,
        ...data
      });
      
      // toast.success("Assignment Successful", {
      //   description: "The request has been assigned to the relief team",
      // });
      
       navigate("/admin/requests");
    } catch (err) {
      toast.error("Assignment Failed", {
        description: err.message || "There was an error assigning the request",
      });
    }
  };

  // Get team data for recent teams
  const recentTeamsWithData = recentTeams.map(recentTeam => {
    const teamData = reliefTeams.find(team => team.id === recentTeam.id);
    return teamData ? {
      ...recentTeam,
      ...teamData
    } : null;
  }).filter(team => team !== null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Request Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error || "The request you're trying to access doesn't exist or may have been removed."}
        </p>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => navigate("/admin/assignments")}>
            Back to Assignments
          </Button>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header with Breadcrumb */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button 
              onClick={() => navigate("/admin/assignments")}
              className="hover:text-primary transition-colors"
            >
              Assignments
            </button>
            <ChevronRight className="h-4 w-4" />
            <span>Assign Request</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate("/admin/assignments")}
                className="rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Assign Assistance Request</h1>
            </div>
            <Badge variant="outline" className="text-sm py-1 px-3">
              ID: {request.id}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Request Summary */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <span>Request Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RequestSummaryCard request={request} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Assignment Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAssign)} className="space-y-8">
                    {/* Team Selection Tabs */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Select Relief Team</h2>
                        
                        <Tabs 
                          value={activeTab} 
                          onValueChange={setActiveTab}
                          className="space-y-6"
                        >
                          <TabsList className="grid grid-cols-2 w-full max-w-xs">
                            <TabsTrigger value="teams">Available Teams</TabsTrigger>
                            <TabsTrigger value="recent">Recently Used</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="teams">
                            <FormField
                              control={form.control}
                              name="reliefTeamId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <TeamSelectionGrid
                                      selectedTeamId={field.value}
                                      onTeamSelect={field.onChange}
                                      teams={reliefTeams}
                                      loading={teamsLoading}
                                    />
                                  </FormControl>
                                  <FormMessage className="mt-2" />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                          
                          <TabsContent value="recent">
                            {recentTeamsWithData.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recentTeamsWithData.map((team) => (
                                  <div
                                    key={team.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                      form.watch("reliefTeamId") === team.id
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "hover:bg-muted/50"
                                    }`}
                                    onClick={() => form.setValue("reliefTeamId", team.id)}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h3 className="font-semibold">{team.name}</h3>
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {team.status || "Available"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Last used: {new Date(team.lastUsed).toLocaleDateString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="border rounded-lg p-6 text-center bg-muted/30">
                                <div className="flex flex-col items-center justify-center gap-3 min-h-[200px]">
                                  <Info className="h-8 w-8 text-muted-foreground" />
                                  <h3 className="font-medium text-lg">No Recent Teams</h3>
                                  <p className="text-muted-foreground max-w-md">
                                    You haven't assigned any requests recently. Your recently used teams will appear here.
                                  </p>
                                </div>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                      
                      {/* Assignment Details */}
                      <div className="pt-4 border-t">
                        <h2 className="text-xl font-semibold mb-4">Assignment Configuration</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="block mb-3 font-medium">Priority Level</FormLabel>
                                <FormControl>
                                  <div className="grid grid-cols-2 gap-3">
                                    {(["Low", "Medium", "High", "Critical"] as const).map((priority) => (
                                      <button
                                        type="button"
                                        key={priority}
                                        className={`flex items-center gap-3 border rounded-lg p-4 transition-all ${
                                          field.value === priority
                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                            : "hover:bg-muted/50"
                                        }`}
                                        onClick={() => field.onChange(priority)}
                                      >
                                        <PriorityIndicator priority={priority} />
                                        <span className="font-medium">{priority}</span>
                                      </button>
                                    ))}
                                  </div>
                                </FormControl>
                                <FormMessage className="mt-2" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem className="h-full">
                                <FormLabel className="font-medium">Assignment Notes</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add any special instructions for the relief team..."
                                    className="min-h-[150px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className="text-sm text-muted-foreground mt-2">
                                  These notes will be visible to the relief team
                                </p>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => navigate("/admin/assignments")}
                        className="min-w-[120px]"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={form.formState.isSubmitting}
                        className="min-w-[160px]"
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          "Confirm Assignment"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};