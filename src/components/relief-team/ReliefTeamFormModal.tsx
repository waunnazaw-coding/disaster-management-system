// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { useReliefTeamStore } from "@/store/relief-team-store";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Loader2 } from "lucide-react";
// // import toast from "react-hot-toast";
// // import type {
// //   ReliefTeam,
// //   CreateReliefTeamRequest,
// //   UpdateReliefTeamRequest,
// // } from "@/types/relief-team";

// // interface ReliefTeamFormModalProps {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   team?: ReliefTeam | null;
// //   onSuccess: () => void;
// // }

// // export function ReliefTeamFormModal({
// //   open,
// //   onOpenChange,
// //   team,
// //   onSuccess,
// // }: ReliefTeamFormModalProps) {
// //   const { createTeam, updateTeam, loading } = useReliefTeamStore();

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     contactInfo: "",
// //     locationId: "",
// //     address: "",
// //     status: "Active",
// //     teamLeaderName: "",
// //     socialMediaURL: "",
// //     email: "",
// //     phone: "",
// //     numberOfMembers: "",
// //     specialization: "",
// //     equipmentDetails: "",
// //     establishedDate: "",
// //   });

// //   useEffect(() => {
// //     if (team) {
// //       setFormData({
// //         name: team.name || "",
// //         contactInfo: team.contactInfo || "",
// //         locationId: team.locationId?.toString() || "",
// //         address: team.address || "",
// //         status: team.status || "Active",
// //         teamLeaderName: team.teamLeaderName || "",
// //         socialMediaURL: team.socialMediaURL || "",
// //         email: team.email || "",
// //         phone: team.phone || "",
// //         numberOfMembers: team.numberOfMembers?.toString() || "",
// //         specialization: team.specialization || "",
// //         equipmentDetails: team.equipmentDetails || "",
// //         establishedDate: team.establishedDate || "",
// //       });
// //     } else {
// //       setFormData({
// //         name: "",
// //         contactInfo: "",
// //         locationId: "",
// //         address: "",
// //         status: "Active",
// //         teamLeaderName: "",
// //         socialMediaURL: "",
// //         email: "",
// //         phone: "",
// //         numberOfMembers: "",
// //         specialization: "",
// //         equipmentDetails: "",
// //         establishedDate: "",
// //       });
// //     }
// //   }, [team, open]);

// //   const handleChange = (field: keyof typeof formData, value: string) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     try {
// //       if (team) {
// //         const updateData: UpdateReliefTeamRequest = {
// //           id: team.id,
// //           name: formData.name,
// //           contactInfo: formData.contactInfo,
// //           locationId: formData.locationId
// //             ? Number.parseInt(formData.locationId)
// //             : undefined,
// //           address: formData.address,
// //           status: formData.status,
// //           teamLeaderName: formData.teamLeaderName,
// //           socialMediaURL: formData.socialMediaURL,
// //           email: formData.email,
// //           phone: formData.phone,
// //           numberOfMembers: formData.numberOfMembers
// //             ? Number.parseInt(formData.numberOfMembers)
// //             : undefined,
// //           specialization: formData.specialization,
// //           equipmentDetails: formData.equipmentDetails,
// //           establishedDate: formData.establishedDate || undefined,
// //         };
// //         await updateTeam(updateData);
// //         toast.success("Team updated successfully");
// //       } else {
// //         const createData: CreateReliefTeamRequest = {
// //           name: formData.name,
// //           contactInfo: formData.contactInfo,
// //           locationId: formData.locationId
// //             ? Number.parseInt(formData.locationId)
// //             : undefined,
// //           address: formData.address,
// //           status: formData.status,
// //           teamLeaderName: formData.teamLeaderName,
// //           socialMediaURL: formData.socialMediaURL,
// //           email: formData.email,
// //           phone: formData.phone,
// //           numberOfMembers: formData.numberOfMembers
// //             ? Number.parseInt(formData.numberOfMembers)
// //             : undefined,
// //           specialization: formData.specialization,
// //           equipmentDetails: formData.equipmentDetails,
// //           establishedDate: formData.establishedDate || undefined,
// //         };
// //         await createTeam(createData);
// //         toast.success("Team created successfully");
// //       }
// //       onSuccess();
// //     } catch (error) {
// //       toast.error(
// //         error instanceof Error ? error.message : `Failed to ${team ? "update" : "create"} team`
// //       );
// //     }
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-0 shadow-2xl">
// //         <DialogHeader className="border-b border-gray-200 px-6 py-4">
// //           <DialogTitle className="text-2xl font-bold text-gray-800">
// //             {team ? "Edit Relief Team" : "Create New Relief Team"}
// //           </DialogTitle>
// //           <DialogDescription className="text-gray-600">
// //             {team
// //               ? "Update the team details below"
// //               : "Fill in the details to create a new relief team"}
// //           </DialogDescription>
// //         </DialogHeader>

// //         <form onSubmit={handleSubmit} className="space-y-6 px-6 py-4">
// //           {/* Basic Information Section */}
// //           <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
// //             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 before:mr-2 before:h-5 before:w-1 before:rounded-full before:bg-blue-600">
// //               Basic Information
// //             </h3>

// //             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
// //               <div>
// //                 <Label htmlFor="name" className="mb-2 block font-medium text-gray-700">
// //                   Team Name *
// //                 </Label>
// //                 <Input
// //                   id="name"
// //                   value={formData.name}
// //                   onChange={(e) => handleChange("name", e.target.value)}
// //                   placeholder="Enter team name"
// //                   required
// //                   className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>

// //               <div>
// //                 <Label htmlFor="teamLeaderName" className="mb-2 block font-medium text-gray-700">
// //                   Team Leader Name *
// //                 </Label>
// //                 <Input
// //                   id="teamLeaderName"
// //                   value={formData.teamLeaderName}
// //                   onChange={(e) => handleChange("teamLeaderName", e.target.value)}
// //                   placeholder="Enter team leader name"
// //                   required
// //                   className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>

// //               <div className="md:col-span-2">
// //                 <Label htmlFor="contactInfo" className="mb-2 block font-medium text-gray-700">
// //                   Contact Information *
// //                 </Label>
// //                 <Textarea
// //                   id="contactInfo"
// //                   value={formData.contactInfo}
// //                   onChange={(e) => handleChange("contactInfo", e.target.value)}
// //                   placeholder="Describe how to contact this team"
// //                   rows={3}
// //                   required
// //                   className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>

// //               <div>
// //                 <Label htmlFor="specialization" className="mb-2 block font-medium text-gray-700">
// //                   Specialization *
// //                 </Label>
// //                 <Select
// //                   value={formData.specialization}
// //                   onValueChange={(value) => handleChange("specialization", value)}
// //                   required
// //                 >
// //                   <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50">
// //                     <SelectValue placeholder="Select specialization" />
// //                   </SelectTrigger>
// //                   <SelectContent className="rounded-lg border-gray-300 shadow-lg">
// //                     <SelectItem value="Natural Disasters">Natural Disasters</SelectItem>
// //                     <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
// //                     <SelectItem value="Search & Rescue">Search & Rescue</SelectItem>
// //                     <SelectItem value="Fire Emergency">Fire Emergency</SelectItem>
// //                     <SelectItem value="Water Rescue">Water Rescue</SelectItem>
// //                     <SelectItem value="Chemical Hazards">Chemical Hazards</SelectItem>
// //                     <SelectItem value="Urban Rescue">Urban Rescue</SelectItem>
// //                     <SelectItem value="Flood Response">Flood Response</SelectItem>
// //                     <SelectItem value="Earthquake Response">Earthquake Response</SelectItem>
// //                     <SelectItem value="Cyclone Response">Cyclone Response</SelectItem>
// //                     <SelectItem value="Landslide Response">Landslide Response</SelectItem>
// //                     <SelectItem value="Community Outreach">Community Outreach</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div>
// //                 <Label htmlFor="numberOfMembers" className="mb-2 block font-medium text-gray-700">
// //                   Number of Members
// //                 </Label>
// //                 <Input
// //                   id="numberOfMembers"
// //                   type="number"
// //                   min={1}
// //                   value={formData.numberOfMembers}
// //                   onChange={(e) => handleChange("numberOfMembers", e.target.value)}
// //                   placeholder="Enter number of members"
// //                   className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Location Information Section */}
// //           <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
// //             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 before:mr-2 before:h-5 before:w-1 before:rounded-full before:bg-green-600">
// //               Location Information
// //             </h3>

// //             <div className="grid grid-cols-1 gap-6">
// //               <div>
// //                 <Label htmlFor="address" className="mb-2 block font-medium text-gray-700">
// //                   Address *
// //                 </Label>
// //                 <Textarea
// //                   id="address"
// //                   value={formData.address}
// //                   onChange={(e) => handleChange("address", e.target.value)}
// //                   placeholder="Enter full address"
// //                   rows={3}
// //                   required
// //                   className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Contact Details Section */}
// //           <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
// //             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 before:mr-2 before:h-5 before:w-1 before:rounded-full before:bg-purple-600">
// //               Contact Details
// //             </h3>

// //             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
// //               <div>
// //                 <Label htmlFor="email" className="mb-2 block font-medium text-gray-700">
// //                   Email *
// //                 </Label>
// //                 <Input
// //                   id="email"
// //                   type="email"
// //                   value={formData.email}
// //                   onChange={(e) => handleChange("email", e.target.value)}
// //                   placeholder="Enter email address"
// //                   required
// //                   className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>

// //               <div>
// //                 <Label htmlFor="phone" className="mb-2 block font-medium text-gray-700">
// //                   Phone *
// //                 </Label>
// //                 <Input
// //                   id="phone"
// //                   type="tel"
// //                   value={formData.phone}
// //                   onChange={(e) => handleChange("phone", e.target.value)}
// //                   placeholder="Enter phone number"
// //                   required
// //                   className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>

// //               <div className="md:col-span-2">
// //                 <Label htmlFor="socialMediaURL" className="mb-2 block font-medium text-gray-700">
// //                   Social Media URL
// //                 </Label>
// //                 <Input
// //                   id="socialMediaURL"
// //                   type="url"
// //                   value={formData.socialMediaURL}
// //                   onChange={(e) => handleChange("socialMediaURL", e.target.value)}
// //                   placeholder="Enter social media URL"
// //                   className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Additional Information Section */}
// //           <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
// //             <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 before:mr-2 before:h-5 before:w-1 before:rounded-full before:bg-amber-600">
// //               Additional Information
// //             </h3>

// //             <div className="grid grid-cols-1 gap-6">
// //               <div>
// //                 <Label htmlFor="equipmentDetails" className="mb-2 block font-medium text-gray-700">
// //                   Equipment Details
// //                 </Label>
// //                 <Textarea
// //                   id="equipmentDetails"
// //                   value={formData.equipmentDetails}
// //                   onChange={(e) => handleChange("equipmentDetails", e.target.value)}
// //                   placeholder="Describe available equipment and resources"
// //                   rows={4}
// //                   className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>

// //               <div className="w-full md:w-1/2">
// //                 <Label htmlFor="establishedDate" className="mb-2 block font-medium text-gray-700">
// //                   Established Date
// //                 </Label>
// //                 <Input
// //                   id="establishedDate"
// //                   type="date"
// //                   value={formData.establishedDate}
// //                   onChange={(e) => handleChange("establishedDate", e.target.value)}
// //                   className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <DialogFooter className="flex justify-end gap-3 border-t border-gray-200 py-4">
// //             <Button
// //               type="button"
// //               variant="outline"
// //               onClick={() => onOpenChange(false)}
// //               className="h-10 rounded-lg px-6 font-medium"
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               type="submit"
// //               disabled={loading}
// //               className="h-10 rounded-lg bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-5 w-5 animate-spin" />
// //                   {team ? "Updating..." : "Creating..."}
// //                 </>
// //               ) : team ? "Update Team" : "Create Team"}
// //             </Button>
// //           </DialogFooter>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client";

// import React, { useState, useEffect } from "react";
// import { useReliefTeamStore } from "@/store/relief-team-store";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { File, FileBoxIcon, FileText, FileTextIcon, FileType2Icon, Loader2, LocateIcon, LocationEditIcon, LucideLocationEdit, PhoneCallIcon } from "lucide-react";
// import toast from "react-hot-toast";
// import type {
//   ReliefTeam,
//   CreateReliefTeamRequest,
//   UpdateReliefTeamRequest,
// } from "@/types/relief-team";

// interface ReliefTeamFormModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   team?: ReliefTeam | null;
//   onSuccess: () => void;
// }

// export function ReliefTeamFormModal({
//   open,
//   onOpenChange,
//   team,
//   onSuccess,
// }: ReliefTeamFormModalProps) {
//   const { createTeam, updateTeam, loading } = useReliefTeamStore();

//   const [formData, setFormData] = useState({
//     name: "",
//     contactInfo: "",
//     locationId: "",
//     address: "",
//     status: "Active",
//     teamLeaderName: "",
//     socialMediaURL: "",
//     email: "",
//     phone: "",
//     numberOfMembers: "",
//     specialization: "",
//     equipmentDetails: "",
//     establishedDate: "",
//   });

//   useEffect(() => {
//     if (team) {
//       setFormData({
//         name: team.name || "",
//         contactInfo: team.contactInfo || "",
//         locationId: team.locationId?.toString() || "",
//         address: team.address || "",
//         status: team.status || "Active",
//         teamLeaderName: team.teamLeaderName || "",
//         socialMediaURL: team.socialMediaURL || "",
//         email: team.email || "",
//         phone: team.phone || "",
//         numberOfMembers: team.numberOfMembers?.toString() || "",
//         specialization: team.specialization || "",
//         equipmentDetails: team.equipmentDetails || "",
//         establishedDate: team.establishedDate || "",
//       });
//     } else {
//       setFormData({
//         name: "",
//         contactInfo: "",
//         locationId: "",
//         address: "",
//         status: "Active",
//         teamLeaderName: "",
//         socialMediaURL: "",
//         email: "",
//         phone: "",
//         numberOfMembers: "",
//         specialization: "",
//         equipmentDetails: "",
//         establishedDate: "",
//       });
//     }
//   }, [team, open]);

//   const handleChange = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (team) {
//         const updateData: UpdateReliefTeamRequest = {
//           id: team.id,
//           name: formData.name,
//           contactInfo: formData.contactInfo,
//           locationId: formData.locationId
//             ? Number.parseInt(formData.locationId)
//             : undefined,
//           address: formData.address,
//           status: formData.status,
//           teamLeaderName: formData.teamLeaderName,
//           socialMediaURL: formData.socialMediaURL,
//           email: formData.email,
//           phone: formData.phone,
//           numberOfMembers: formData.numberOfMembers
//             ? Number.parseInt(formData.numberOfMembers)
//             : undefined,
//           specialization: formData.specialization,
//           equipmentDetails: formData.equipmentDetails,
//           establishedDate: formData.establishedDate || undefined,
//         };
//         await updateTeam(updateData);
//         toast.success("Team updated successfully");
//       } else {
//         const createData: CreateReliefTeamRequest = {
//           name: formData.name,
//           contactInfo: formData.contactInfo,
//           locationId: formData.locationId
//             ? Number.parseInt(formData.locationId)
//             : undefined,
//           address: formData.address,
//           status: formData.status,
//           teamLeaderName: formData.teamLeaderName,
//           socialMediaURL: formData.socialMediaURL,
//           email: formData.email,
//           phone: formData.phone,
//           numberOfMembers: formData.numberOfMembers
//             ? Number.parseInt(formData.numberOfMembers)
//             : undefined,
//           specialization: formData.specialization,
//           equipmentDetails: formData.equipmentDetails,
//           establishedDate: formData.establishedDate || undefined,
//         };
//         await createTeam(createData);
//         toast.success("Team created successfully");
//       }
//       onSuccess();
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : `Failed to ${team ? "update" : "create"} team`
//       );
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[760px] max-h-[85vh] overflow-y-auto rounded-2xl p-8 bg-white shadow-xl border border-gray-200">
//         <DialogHeader className="mb-6">
//           <DialogTitle className="text-3xl font-bold text-gray-900">
//             {team ? "Edit Relief Team" : "Create New Relief Team"}
//           </DialogTitle>
//           <DialogDescription className="text-gray-600 mt-2 text-base">
//             {team
//               ? "Update the details of your relief team below."
//               : "Fill in the details to create a new relief team."}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-10">
//           {/* Basic Information Section */}
//           <section className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
//             <h4 className="font-semibold text-gray-800 text-lg mb-6 flex items-center gap-2 flex">
//               <FileText className="h-6 w-6" />
//               <p>Basic Information</p>
//             </h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Label htmlFor="name" className="mb-2 font-medium text-gray-700">
//                   Team Name *
//                 </Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   placeholder="Enter team name"
//                   required
//                   className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="teamLeaderName" className="mb-2 font-medium text-gray-700">
//                   Team Leader Name *
//                 </Label>
//                 <Input
//                   id="teamLeaderName"
//                   value={formData.teamLeaderName}
//                   onChange={(e) => handleChange("teamLeaderName", e.target.value)}
//                   placeholder="Enter team leader name"
//                   required
//                   className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <Label htmlFor="contactInfo" className="mb-2 font-medium text-gray-700">
//                 Contact Information *
//               </Label>
//               <Textarea
//                 id="contactInfo"
//                 value={formData.contactInfo}
//                 onChange={(e) => handleChange("contactInfo", e.target.value)}
//                 placeholder="Describe how to contact this team"
//                 rows={3}
//                 required
//                 className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//               />
//             </div>

//             <div className="mt-6">
//               <Label htmlFor="specialization" className="mb-2 font-medium text-gray-700">
//                 Specialization *
//               </Label>
//               <Select
//                 value={formData.specialization}
//                 onValueChange={(value) => handleChange("specialization", value)}
//                 required
//               >
//                 <SelectTrigger className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500">
//                   <SelectValue placeholder="Select specialization" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Natural Disasters">Natural Disasters</SelectItem>
//                   <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
//                   <SelectItem value="Search & Rescue">Search & Rescue</SelectItem>
//                   <SelectItem value="Fire Emergency">Fire Emergency</SelectItem>
//                   <SelectItem value="Water Rescue">Water Rescue</SelectItem>
//                   <SelectItem value="Chemical Hazards">Chemical Hazards</SelectItem>
//                   <SelectItem value="Urban Rescue">Urban Rescue</SelectItem>
//                   <SelectItem value="Flood Response">Flood Response</SelectItem>
//                   <SelectItem value="Earthquake Response">Earthquake Response</SelectItem>
//                   <SelectItem value="Cyclone Response">Cyclone Response</SelectItem>
//                   <SelectItem value="Landslide Response">Landslide Response</SelectItem>
//                   <SelectItem value="Community Outreach">Community Outreach</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </section>

//           {/* Location Information Section */}
//           <section className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
//             <h4 className="font-semibold text-gray-800 text-lg mb-6 flex items-center gap-2">
//               <LucideLocationEdit  />
//               <p>Location Information</p>
//             </h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Label htmlFor="numberOfMembers" className="mb-2 font-medium text-gray-700">
//                   Number of Members
//                 </Label>
//                 <Input
//                   id="numberOfMembers"
//                   type="number"
//                   min={1}
//                   value={formData.numberOfMembers}
//                   onChange={(e) => handleChange("numberOfMembers", e.target.value)}
//                   placeholder="Enter number of members"
//                   className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <Label htmlFor="address" className="mb-2 font-medium text-gray-700">
//                 Address *
//               </Label>
//               <Textarea
//                 id="address"
//                 value={formData.address}
//                 onChange={(e) => handleChange("address", e.target.value)}
//                 placeholder="Enter full address"
//                 rows={3}
//                 required
//                 className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//               />
//             </div>
//           </section>

//           {/* Contact Details Section */}
//           <section className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">

//            <h4 className="font-semibold text-gray-800 text-lg mb-6 flex items-center gap-2">
//               <PhoneCallIcon  />
//               <p>Contact Details</p>
//             </h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Label htmlFor="email" className="mb-2 font-medium text-gray-700">
//                   Email *
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   placeholder="Enter email address"
//                   required
//                   className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phone" className="mb-2 font-medium text-gray-700">
//                   Phone *
//                 </Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => handleChange("phone", e.target.value)}
//                   placeholder="Enter phone number"
//                   required
//                   className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <Label htmlFor="socialMediaURL" className="mb-2 font-medium text-gray-700">
//                 Social Media URL
//               </Label>
//               <Input
//                 id="socialMediaURL"
//                 type="url"
//                 value={formData.socialMediaURL}
//                 onChange={(e) => handleChange("socialMediaURL", e.target.value)}
//                 placeholder="Enter social media URL"
//                 className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//               />
//             </div>
//           </section>

//           {/* Additional Information Section */}
//           <section className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
//            <h4 className="font-semibold text-gray-800 text-lg mb-6 flex items-center gap-2">
//               <FileType2Icon  />
//               <p>Additional Information</p>
//             </h4>
//             <div className="mb-6">
//               <Label htmlFor="equipmentDetails" className="mb-2 font-medium text-gray-700">
//                 Equipment Details
//               </Label>
//               <Textarea
//                 id="equipmentDetails"
//                 value={formData.equipmentDetails}
//                 onChange={(e) => handleChange("equipmentDetails", e.target.value)}
//                 placeholder="Describe available equipment and resources"
//                 rows={4}
//                 className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//               />
//             </div>

//             <div>
//               <Label htmlFor="establishedDate" className="mb-2 font-medium text-gray-700">
//                 Established Date
//               </Label>
//               <Input
//                 id="establishedDate"
//                 type="date"
//                 value={formData.establishedDate}
//                 onChange={(e) => handleChange("establishedDate", e.target.value)}
//                 className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
//               />
//             </div>
//           </section>

//           <DialogFooter className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-100"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white flex items-center"
//             >
//               {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
//               {team ? "Update Team" : "Create Team"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useReliefTeamStore } from "@/store/relief-team-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2, MapPin, Phone, Settings } from "lucide-react";
import toast from "react-hot-toast";
import type {
  ReliefTeam,
  CreateReliefTeamRequest,
  UpdateReliefTeamRequest,
} from "@/types/relief-team";

interface ReliefTeamFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: ReliefTeam | null;
  onSuccess: () => void;
}

export function ReliefTeamFormModal({
  open,
  onOpenChange,
  team,
  onSuccess,
}: ReliefTeamFormModalProps) {
  const { createTeam, updateTeam, loading } = useReliefTeamStore();

  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    locationId: "",
    address: "",
    status: "Active",
    teamLeaderName: "",
    socialMediaURL: "",
    email: "",
    phone: "",
    numberOfMembers: "",
    specialization: "",
    equipmentDetails: "",
    establishedDate: "",
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        contactInfo: team.contactInfo || "",
        locationId: team.locationId?.toString() || "",
        address: team.address || "",
        status: team.status || "Active",
        teamLeaderName: team.teamLeaderName || "",
        socialMediaURL: team.socialMediaURL || "",
        email: team.email || "",
        phone: team.phone || "",
        numberOfMembers: team.numberOfMembers?.toString() || "",
        specialization: team.specialization || "",
        equipmentDetails: team.equipmentDetails || "",
        establishedDate: team.establishedDate || "",
      });
    } else {
      setFormData({
        name: "",
        contactInfo: "",
        locationId: "",
        address: "",
        status: "Active",
        teamLeaderName: "",
        socialMediaURL: "",
        email: "",
        phone: "",
        numberOfMembers: "",
        specialization: "",
        equipmentDetails: "",
        establishedDate: "",
      });
    }
  }, [team, open]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (team) {
        const updateData: UpdateReliefTeamRequest = {
          id: team.id,
          name: formData.name,
          contactInfo: formData.contactInfo,
          locationId: formData.locationId
            ? Number.parseInt(formData.locationId)
            : undefined,
          address: formData.address,
          status: formData.status,
          teamLeaderName: formData.teamLeaderName,
          socialMediaURL: formData.socialMediaURL,
          email: formData.email,
          phone: formData.phone,
          numberOfMembers: formData.numberOfMembers
            ? Number.parseInt(formData.numberOfMembers)
            : undefined,
          specialization: formData.specialization,
          equipmentDetails: formData.equipmentDetails,
          establishedDate: formData.establishedDate || undefined,
        };
        await updateTeam(updateData);
        toast.success("Team updated successfully");
      } else {
        const createData: CreateReliefTeamRequest = {
          name: formData.name,
          contactInfo: formData.contactInfo,
          locationId: formData.locationId
            ? Number.parseInt(formData.locationId)
            : undefined,
          address: formData.address,
          status: formData.status,
          teamLeaderName: formData.teamLeaderName,
          socialMediaURL: formData.socialMediaURL,
          email: formData.email,
          phone: formData.phone,
          numberOfMembers: formData.numberOfMembers
            ? Number.parseInt(formData.numberOfMembers)
            : undefined,
          specialization: formData.specialization,
          equipmentDetails: formData.equipmentDetails,
          establishedDate: formData.establishedDate || undefined,
        };
        await createTeam(createData);
        toast.success("Team created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${team ? "update" : "create"} team`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 bg-white shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-8 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900">
              {team ? "Edit Relief Team" : "Create New Relief Team"}
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-600 mt-2">
              {team
                ? "Update the details of your relief team below."
                : "Fill in the details to create a new relief team."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information Section */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <h4 className="font-bold text-blue-900 text-xl mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="name"
                  className="mb-2 font-semibold text-gray-700 text-base"
                >
                  Team Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter team name"
                  required
                  className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
              <div>
                <Label
                  htmlFor="teamLeaderName"
                  className="mb-2 font-semibold text-gray-700 text-base"
                >
                  Team Leader Name *
                </Label>
                <Input
                  id="teamLeaderName"
                  value={formData.teamLeaderName}
                  onChange={(e) =>
                    handleChange("teamLeaderName", e.target.value)
                  }
                  placeholder="Enter team leader name"
                  required
                  className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label
                htmlFor="contactInfo"
                className="mb-2 font-semibold text-gray-700 text-base"
              >
                Contact Information *
              </Label>
              <Textarea
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => handleChange("contactInfo", e.target.value)}
                placeholder="Describe how to contact this team"
                rows={4}
                required
                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </div>

            <div className="mt-6 w-full">
              <Label
                htmlFor="specialization"
                className="mb-2 font-semibold text-gray-700 text-base"
              >
                Specialization *
              </Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) => handleChange("specialization", value)}
                required
              >
                {/* ⬇️ add w-full here */}
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                  <SelectItem value="Natural Disasters">
                    Natural Disasters
                  </SelectItem>
                  <SelectItem value="Medical Emergency">
                    Medical Emergency
                  </SelectItem>
                  <SelectItem value="Search & Rescue">
                    Search & Rescue
                  </SelectItem>
                  <SelectItem value="Fire Emergency">Fire Emergency</SelectItem>
                  <SelectItem value="Water Rescue">Water Rescue</SelectItem>
                  <SelectItem value="Chemical Hazards">
                    Chemical Hazards
                  </SelectItem>
                  <SelectItem value="Urban Rescue">Urban Rescue</SelectItem>
                  <SelectItem value="Flood Response">Flood Response</SelectItem>
                  <SelectItem value="Earthquake Response">
                    Earthquake Response
                  </SelectItem>
                  <SelectItem value="Cyclone Response">
                    Cyclone Response
                  </SelectItem>
                  <SelectItem value="Landslide Response">
                    Landslide Response
                  </SelectItem>
                  <SelectItem value="Community Outreach">
                    Community Outreach
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Location Information Section */}
          <section className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <h4 className="font-bold text-green-900 text-xl mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <MapPin className="h-6 w-6 text-green-700" />
              </div>
              Location & Team Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="numberOfMembers"
                  className="mb-2 font-semibold text-gray-700 text-base"
                >
                  Number of Members
                </Label>
                <Input
                  id="numberOfMembers"
                  type="number"
                  min={1}
                  value={formData.numberOfMembers}
                  onChange={(e) =>
                    handleChange("numberOfMembers", e.target.value)
                  }
                  placeholder="Enter number of members"
                  className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                />
              </div>
              <div>
                <Label
                  htmlFor="establishedDate"
                  className="mb-2 font-semibold text-gray-700 text-base"
                >
                  Established Date
                </Label>
                <Input
                  id="establishedDate"
                  type="date"
                  value={formData.establishedDate}
                  onChange={(e) =>
                    handleChange("establishedDate", e.target.value)
                  }
                  className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label
                htmlFor="address"
                className="mb-2 font-semibold text-gray-700 text-base"
              >
                Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter full address"
                rows={3}
                required
                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
              />
            </div>
          </section>

          {/* Contact Details Section */}
          <section className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
            <h4 className="font-bold text-purple-900 text-xl mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Phone className="h-6 w-6 text-purple-700" />
              </div>
              Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 font-semibold text-gray-700 text-base"
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="mb-2 font-semibold text-gray-700 text-base"
                >
                  Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  required
                  className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label
                htmlFor="socialMediaURL"
                className="mb-2 font-semibold text-gray-700 text-base"
              >
                Social Media URL
              </Label>
              <Input
                id="socialMediaURL"
                type="url"
                value={formData.socialMediaURL}
                onChange={(e) => handleChange("socialMediaURL", e.target.value)}
                placeholder="Enter social media URL"
                className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              />
            </div>
          </section>

          {/* Additional Information Section */}
          <section className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
            <h4 className="font-bold text-orange-900 text-xl mb-6 flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Settings className="h-6 w-6 text-orange-700" />
              </div>
              Additional Information
            </h4>
            <div className="mb-6">
              <Label
                htmlFor="equipmentDetails"
                className="mb-2 font-semibold text-gray-700 text-base"
              >
                Equipment Details
              </Label>
              <Textarea
                id="equipmentDetails"
                value={formData.equipmentDetails}
                onChange={(e) =>
                  handleChange("equipmentDetails", e.target.value)
                }
                placeholder="Describe available equipment and resources"
                rows={4}
                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
              />
            </div>
          </section>

          <DialogFooter className="flex justify-end gap-4 pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-8 py-3 rounded-xl border-gray-200 hover:border-gray-300 text-base font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {team ? "Update Team" : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
