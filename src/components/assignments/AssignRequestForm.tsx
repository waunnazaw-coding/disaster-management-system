// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { useReliefTeams } from "@/hooks/useReliefTeams";
// import { Textarea } from "@/components/ui/textarea";
// import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
// import type { AssistanceRequest } from "@/types/assistanceRequests";

// const formSchema = z.object({
//   reliefTeamId: z.number().min(1, "Please select a relief team"),
//   priority: z.enum(["Low", "Medium", "High", "Critical"]),
//   notes: z.string().optional(),
// });

// export const AssignRequestForm = ({
//   request,
//   onSubmit,
//   loading,
// }: {
//   request: AssistanceRequest;
//   onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
//   loading: boolean;
// }) => {
//   const { reliefTeams, loading: teamsLoading } = useReliefTeams();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       priority: "Medium",
//     },
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="space-y-4">
//           <div className="border p-4 rounded-lg bg-gray-50">
//             <h4 className="font-medium mb-2">Request Details</h4>
//             <p className="text-sm text-gray-600">
//               {request.supportType} - {request.quantity} {request.unit}
//             </p>
//             <p className="text-sm text-gray-600 mt-1">{request.description}</p>
//           </div>

//           <FormField
//             control={form.control}
//             name="reliefTeamId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Relief Team *</FormLabel>
//                 <Select
//                   onValueChange={(value) => field.onChange(Number(value))}
//                   disabled={teamsLoading}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a relief team" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {reliefTeams.map((team) => (
//                       <SelectItem key={team.id} value={team.id.toString()}>
//                         {team.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="priority"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Priority *</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select priority" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Low">
//                       <RequestPriorityBadge priority="Low" />
//                     </SelectItem>
//                     <SelectItem value="Medium">
//                       <RequestPriorityBadge priority="Medium" />
//                     </SelectItem>
//                     <SelectItem value="High">
//                       <RequestPriorityBadge priority="High" />
//                     </SelectItem>
//                     <SelectItem value="Critical">
//                       <RequestPriorityBadge priority="Critical" />
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="notes"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Notes (Optional)</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Add any special instructions for the relief team..."
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Button type="submit" disabled={loading} className="w-full">
//           {loading ? "Assigning..." : "Assign Request"}
//         </Button>
//       </form>
//     </Form>
//   );
// };


// src/components/assignments/AssignRequestForm/AssignRequestForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useReliefTeams } from "@/hooks/useReliefTeams";
import { Textarea } from "@/components/ui/textarea";
import { RequestPriorityBadge } from "@/components/assistance_requests/RequestPriorityBadge";
import type { AssistanceRequest } from "@/types/assistanceRequests";
import { TeamSelectionGrid } from "./TeamSelectionGrid";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  reliefTeamId: z.number().min(1, "Please select a relief team"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  notes: z.string().optional(),
});

export const AssignRequestForm = ({
  request,
  onSubmit,
  loading,
}: {
  request: AssistanceRequest;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  loading: boolean;
}) => {
  const { reliefTeams, loading: teamsLoading } = useReliefTeams();
  const [searchTerm, setSearchTerm] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "Medium",
    },
  });

  const selectedTeamId = form.watch("reliefTeamId");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="border p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium mb-2">Request Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Support Type</p>
                <p className="font-medium">{request.supportType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">
                  {request.quantity} {request.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requester</p>
                <p className="font-medium">{request.userName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium line-clamp-1">{request.detailedAddress}</p>
              </div>
            </div>
            {request.description && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{request.description}</p>
              </div>
            )}
          </div>

          <div>
            <FormField
              control={form.control}
              name="reliefTeamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Relief Team *</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {teamsLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : (
                        <TeamSelectionGrid
                          teams={reliefTeams}
                          selectedTeamId={field.value}
                          onTeamSelect={field.onChange}
                          searchTerm={searchTerm}
                          onSearchChange={setSearchTerm}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority *</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-4 gap-2">
                      {(["Low", "Medium", "High", "Critical"] as const).map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          className={`border rounded-md p-2 text-center transition-colors ${
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
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any special instructions for the relief team..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning Request...
            </>
          ) : (
            "Assign Request"
          )}
        </Button>
      </form>
    </Form>
  );
};