// "use client";

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import {
//   Users,
//   MapPin,
//   Calendar,
//   Mail,
//   UserPlus,
//   Loader2,
//   Shield,
//   Clock,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useReliefTeamStore } from "@/store/relief-team-store";
// import toast from "react-hot-toast";
// import type { ReliefTeam, CreateInviteRequest } from "@/types/relief-team";

// interface ReliefTeamDetailsModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   team: ReliefTeam | null;
// }

// export function ReliefTeamDetailsModal({
//   open,
//   onOpenChange,
//   team,
// }: ReliefTeamDetailsModalProps) {
//   const { createInvite, loading } = useReliefTeamStore();
//   const [showInviteForm, setShowInviteForm] = useState(false);
//   const [inviteData, setInviteData] = useState({
//     email: "",
//     role: "",
//   });

//   if (!team) return null;

//   const handleInvite = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!inviteData.email || !inviteData.role) {
//       toast.error("Please fill in all invite fields.");
//       return;
//     }

//     try {
//       const inviteRequest: CreateInviteRequest = {
//         teamId: team.id,
//         email: inviteData.email,
//         role: inviteData.role,
//       };

//       await createInvite(inviteRequest);
//       toast.success(`Invitation sent to ${inviteData.email} successfully`);
//       setShowInviteForm(false);
//       setInviteData({ email: "", role: "" });
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to send invitation");
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800";
//       case "Deployed":
//         return "bg-blue-100 text-blue-800";
//       case "Inactive":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto rounded-lg p-6 bg-white shadow-lg">
//           <DialogHeader>
//             <div className="flex justify-between items-start">
//               <div className="max-w-[70%]">
//                 <DialogTitle className="text-2xl font-semibold text-gray-900 truncate">
//                   {team.name}
//                 </DialogTitle>
//                 <DialogDescription className="text-muted-foreground mt-1 truncate">
//                   Led by {team.teamLeaderName}
//                 </DialogDescription>
//               </div>
//               <Badge className={`${getStatusColor(team.status)} px-4 py-1 rounded-full text-sm font-medium flex-shrink-0`}>
//                 {team.status}
//               </Badge>
//             </div>
//           </DialogHeader>

//           <div className="mt-6 space-y-8">
//             {/* Team Details Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <InfoLine icon={<MapPin className="h-6 w-6 text-muted-foreground" />} label="Address">
//                 {team.address}
//               </InfoLine>
//               <InfoLine icon={<Users className="h-6 w-6 text-muted-foreground" />} label="Team Size">
//                 {team.numberOfMembers ?? 0} members
//               </InfoLine>
//               <InfoLine icon={<Shield className="h-6 w-6 text-muted-foreground" />} label="Specialization">
//                 <Badge variant="secondary" className="capitalize">{team.specialization}</Badge>
//               </InfoLine>
//               <InfoLine icon={<Mail className="h-6 w-6 text-muted-foreground" />} label="Email">
//                 {team.email}
//               </InfoLine>
//               <InfoLine icon={<Users className="h-6 w-6 text-muted-foreground" />} label="Team Leader">
//                 {team.teamLeaderName}
//               </InfoLine>
//               <InfoLine icon={<Clock className="h-6 w-6 text-muted-foreground" />} label="Status">
//                 <Badge className={getStatusColor(team.status)} variant="secondary">
//                   {team.status}
//                 </Badge>
//               </InfoLine>
//               <InfoLine icon={<Calendar className="h-6 w-6 text-muted-foreground" />} label="Established">
//                 {team.establishedDate ? new Date(team.establishedDate).toLocaleDateString() : "Not specified"}
//               </InfoLine>
//               <InfoLine icon={<Users className="h-6 w-6 text-muted-foreground" />} label="Phone">
//                 {team.phone}
//               </InfoLine>
//             </div>

//             {/* Equipment Details */}
//             {team.equipmentDetails && (
//               <section className="bg-gray-50 rounded-md p-4 shadow-sm">
//                 <h4 className="text-lg font-semibold mb-2">Equipment Details</h4>
//                 <p className="text-muted-foreground whitespace-pre-wrap">{team.equipmentDetails}</p>
//               </section>
//             )}

//             {/* Social Media URL */}
//             {team.socialMediaURL && (
//               <section>
//                 <h4 className="text-lg font-semibold mb-2">Social Media</h4>
//                 <a
//                   href={team.socialMediaURL}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 underline break-all"
//                 >
//                   {team.socialMediaURL}
//                 </a>
//               </section>
//             )}

//             <Separator />

//             {/* Team Stats Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Team Statistics</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <StatRow label="Total Members" value={team.numberOfMembers ?? 0} />
//                 <StatRow label="Location ID" value={team.locationId ?? "N/A"} />
//                 <StatRow label="Status" value={<Badge className={getStatusColor(team.status)} variant="secondary">{team.status}</Badge>} />
//                 <StatRow label="Established" value={team.establishedDate ? new Date(team.establishedDate).getFullYear() : "N/A"} />
//               </CardContent>
//             </Card>

//             <Separator />

//             {/* Timestamps */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
//               <Timestamp label="Created" dateString={team.createdAt!} />
//               <Timestamp label="Last Updated" dateString={team.updatedAt!} />
//             </div>

//             <Separator />

//             {/* Quick Actions */}
//             <section className="space-y-4">
//               <h4 className="text-lg font-semibold">Quick Actions</h4>
//               <div className="flex flex-wrap gap-3">
//                 <Button
//                   onClick={() => setShowInviteForm(!showInviteForm)}
//                   className="flex items-center gap-2"
//                 >
//                   <UserPlus className="h-5 w-5" />
//                   Invite Member
//                 </Button>
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <Users className="h-5 w-5" />
//                   View Members
//                 </Button>
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   Schedule Training
//                 </Button>
//               </div>
//             </section>

//             {/* Invite Form */}
//             {showInviteForm && (
//               <section className="bg-gray-50 rounded-md p-6 shadow-sm">
//                 <h4 className="text-lg font-semibold mb-4">Invite Team Member</h4>
//                 <form onSubmit={handleInvite} className="space-y-6">
//                   <div className="grid gap-6 md:grid-cols-2">
//                     <div>
//                       <Label htmlFor="email" className="mb-1 font-semibold">
//                         Email Address <span className="text-destructive">*</span>
//                       </Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         value={inviteData.email}
//                         onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
//                         placeholder="Enter email address"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="role" className="mb-1 font-semibold">
//                         Role <span className="text-destructive">*</span>
//                       </Label>
//                       <Select
//                         value={inviteData.role}
//                         onValueChange={(value) => setInviteData((prev) => ({ ...prev, role: value }))}
//                       >
//                         <SelectTrigger id="role">
//                           <SelectValue placeholder="Select role" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Member">Member</SelectItem>
//                           <SelectItem value="Specialist">Specialist</SelectItem>
//                           <SelectItem value="Coordinator">Coordinator</SelectItem>
//                           <SelectItem value="Medic">Medic</SelectItem>
//                           <SelectItem value="Driver">Driver</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="flex gap-4">
//                     <Button type="submit" disabled={loading} className="flex items-center gap-2">
//                       {loading && <Loader2 className="h-5 w-5 animate-spin" />}
//                       <Mail className="h-5 w-5" />
//                       Send Invite
//                     </Button>
//                     <Button variant="outline" onClick={() => setShowInviteForm(false)}>
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               </section>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// // Helper components for neatness:
// const InfoLine: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({
//   icon,
//   label,
//   children,
// }) => (
//   <div className="flex items-center gap-3 text-gray-700">
//     <div className="flex items-center justify-center shrink-0 text-muted-foreground">{icon}</div>
//     <div className="flex flex-col leading-tight truncate">
//       <span className="font-semibold">{label}</span>
//       <span className="truncate">{children}</span>
//     </div>
//   </div>
// );

// const StatRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
//   <div className="flex justify-between text-sm text-gray-600">
//     <span>{label}</span>
//     <span className="font-medium">{value}</span>
//   </div>
// );

// const Timestamp: React.FC<{ label: string; dateString: string }> = ({ label, dateString }) => {
//   const formatted = new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <div className="flex items-center gap-2 text-muted-foreground text-sm">
//       <Calendar className="h-4 w-4" />
//       <div>
//         <p className="font-semibold text-gray-700">{label}</p>
//         <p className="text-gray-500">{formatted}</p>
//       </div>
//     </div>
//   );
// };


"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  MapPin,
  Calendar,
  Mail,
  UserPlus,
  Loader2,
  Shield,
  Clock,
  Phone,
  Globe,
  Award,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReliefTeamStore } from "@/store/relief-team-store"
import toast from "react-hot-toast"
import type { ReliefTeam, CreateInviteRequest } from "@/types/relief-team"

interface ReliefTeamDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: ReliefTeam | null
}

export function ReliefTeamDetailsModal({ open, onOpenChange, team }: ReliefTeamDetailsModalProps) {
  const { createInvite, loading } = useReliefTeamStore()
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "",
  })

  if (!team) return null

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inviteData.email || !inviteData.role) {
      toast.error("Please fill in all invite fields.")
      return
    }

    try {
      const inviteRequest: CreateInviteRequest = {
        teamId: team.id,
        email: inviteData.email,
        role: inviteData.role,
      }

      await createInvite(inviteRequest)
      toast.success(`Invitation sent to ${inviteData.email} successfully`)
      setShowInviteForm(false)
      setInviteData({ email: "", role: "" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitation")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Deployed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Inactive":
        return "bg-gray-50 text-gray-600 border-gray-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Activity className="h-4 w-4 text-emerald-600" />
      case "Deployed":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "Inactive":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 bg-white shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-8 border-b border-gray-100">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 pr-6">
                <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">{team.name}</DialogTitle>
                <DialogDescription className="text-lg text-gray-600 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Led by {team.teamLeaderName}
                </DialogDescription>
              </div>
              <Badge
                className={`${getStatusColor(team.status)} px-4 py-2 text-sm font-semibold rounded-full border flex items-center gap-2`}
              >
                {getStatusIcon(team.status)}
                {team.status}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard icon={<MapPin className="h-6 w-6 text-blue-600" />} title="Location" value={team.address} />
            <InfoCard
              icon={<Users className="h-6 w-6 text-green-600" />}
              title="Team Size"
              value={`${team.numberOfMembers ?? 0} members`}
            />
            <InfoCard
              icon={<Shield className="h-6 w-6 text-purple-600" />}
              title="Specialization"
              value={team.specialization}
            />
            <InfoCard icon={<Mail className="h-6 w-6 text-orange-600" />} title="Email" value={team.email} />
            <InfoCard icon={<Phone className="h-6 w-6 text-red-600" />} title="Phone" value={team.phone} />
            <InfoCard
              icon={<Calendar className="h-6 w-6 text-indigo-600" />}
              title="Established"
              value={team.establishedDate ? new Date(team.establishedDate).getFullYear().toString() : "Not specified"}
            />
          </div>

          {/* Contact Information */}
          <Card className="rounded-2xl border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{team.contactInfo}</p>
            </CardContent>
          </Card>

          {/* Equipment Details */}
          {team.equipmentDetails && (
            <Card className="rounded-2xl border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Equipment & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                  {team.equipmentDetails}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Social Media */}
          {team.socialMediaURL && (
            <Card className="rounded-2xl border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={team.socialMediaURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all bg-blue-50 p-4 rounded-xl block transition-colors"
                >
                  {team.socialMediaURL}
                </a>
              </CardContent>
            </Card>
          )}

          {/* Team Statistics */}
          <Card className="rounded-2xl border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Team Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Members" value={team.numberOfMembers ?? 0} />
              <StatItem label="Status" value={team.status} />
              <StatItem label="Location ID" value={team.locationId ?? "N/A"} />
              <StatItem
                label="Years Active"
                value={
                  team.establishedDate ? new Date().getFullYear() - new Date(team.establishedDate).getFullYear() : "N/A"
                }
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {/* <Card className="rounded-2xl border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setShowInviteForm(!showInviteForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg flex items-center gap-2 border-gray-200 hover:border-gray-300 bg-transparent"
                >
                  <Users className="h-4 w-4" />
                  View Members
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg flex items-center gap-2 border-gray-200 hover:border-gray-300 bg-transparent"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Training
                </Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Invite Form */}
          {/* {showInviteForm && (
            <Card className="rounded-2xl border-blue-200 bg-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-blue-900">Invite Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvite} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email" className="mb-2 font-semibold text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={inviteData.email}
                        onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        required
                        className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role" className="mb-2 font-semibold text-gray-700">
                        Role *
                      </Label>
                      <Select
                        value={inviteData.role}
                        onValueChange={(value) => setInviteData((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger
                          id="role"
                          className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Specialist">Specialist</SelectItem>
                          <SelectItem value="Coordinator">Coordinator</SelectItem>
                          <SelectItem value="Medic">Medic</SelectItem>
                          <SelectItem value="Driver">Driver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Mail className="h-4 w-4" />
                      Send Invite
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInviteForm(false)}
                      className="rounded-lg border-gray-200 hover:border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )} */}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <div>
                <p className="font-medium text-gray-700">Created</p>
                <p>{team.createdAt ? formatDate(team.createdAt) : "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <div>
                <p className="font-medium text-gray-700">Last Updated</p>
                <p>{team.updatedAt ? formatDate(team.updatedAt) : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper Components
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ icon, title, value }) => (
  <Card className="rounded-xl border-gray-100 hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-base font-semibold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

const StatItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
)
