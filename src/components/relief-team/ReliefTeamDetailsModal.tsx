"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MapPin,
  Calendar,
  Mail,
  UserPlus,
  Loader2,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReliefTeamStore } from "@/store/relief-team-store";
import toast from "react-hot-toast";
import type { ReliefTeam, CreateInviteRequest } from "@/types/relief-team";

interface ReliefTeamDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: ReliefTeam | null;
}

export function ReliefTeamDetailsModal({
  open,
  onOpenChange,
  team,
}: ReliefTeamDetailsModalProps) {
  const { createInvite, loading } = useReliefTeamStore();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "",
  });

  if (!team) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteData.email || !inviteData.role) {
      toast.error("Please fill in all invite fields.");
      return;
    }

    try {
      const inviteRequest: CreateInviteRequest = {
        teamId: team.id,
        email: inviteData.email,
        role: inviteData.role,
      };

      await createInvite(inviteRequest);
      toast.success(`Invitation sent to ${inviteData.email} successfully`);
      setShowInviteForm(false);
      setInviteData({ email: "", role: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitation");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Deployed":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto rounded-lg p-6 bg-white shadow-lg">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="max-w-[70%]">
                <DialogTitle className="text-2xl font-semibold text-gray-900 truncate">
                  {team.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1 truncate">
                  Led by {team.teamLeaderName}
                </DialogDescription>
              </div>
              <Badge className={`${getStatusColor(team.status)} px-4 py-1 rounded-full text-sm font-medium flex-shrink-0`}>
                {team.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-8">
            {/* Team Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoLine icon={<MapPin className="h-6 w-6 text-muted-foreground" />} label="Address">
                {team.address}
              </InfoLine>
              <InfoLine icon={<Users className="h-6 w-6 text-muted-foreground" />} label="Team Size">
                {team.numberOfMembers ?? 0} members
              </InfoLine>
              <InfoLine icon={<Shield className="h-6 w-6 text-muted-foreground" />} label="Specialization">
                <Badge variant="secondary" className="capitalize">{team.specialization}</Badge>
              </InfoLine>
              <InfoLine icon={<Mail className="h-6 w-6 text-muted-foreground" />} label="Email">
                {team.email}
              </InfoLine>
              <InfoLine icon={<Users className="h-6 w-6 text-muted-foreground" />} label="Team Leader">
                {team.teamLeaderName}
              </InfoLine>
              <InfoLine icon={<Clock className="h-6 w-6 text-muted-foreground" />} label="Status">
                <Badge className={getStatusColor(team.status)} variant="secondary">
                  {team.status}
                </Badge>
              </InfoLine>
              <InfoLine icon={<Calendar className="h-6 w-6 text-muted-foreground" />} label="Established">
                {team.establishedDate ? new Date(team.establishedDate).toLocaleDateString() : "Not specified"}
              </InfoLine>
              <InfoLine icon={<Users className="h-6 w-6 text-muted-foreground" />} label="Phone">
                {team.phone}
              </InfoLine>
            </div>

            {/* Equipment Details */}
            {team.equipmentDetails && (
              <section className="bg-gray-50 rounded-md p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-2">Equipment Details</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{team.equipmentDetails}</p>
              </section>
            )}

            {/* Social Media URL */}
            {team.socialMediaURL && (
              <section>
                <h4 className="text-lg font-semibold mb-2">Social Media</h4>
                <a
                  href={team.socialMediaURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {team.socialMediaURL}
                </a>
              </section>
            )}

            <Separator />

            {/* Team Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatRow label="Total Members" value={team.numberOfMembers ?? 0} />
                <StatRow label="Location ID" value={team.locationId ?? "N/A"} />
                <StatRow label="Status" value={<Badge className={getStatusColor(team.status)} variant="secondary">{team.status}</Badge>} />
                <StatRow label="Established" value={team.establishedDate ? new Date(team.establishedDate).getFullYear() : "N/A"} />
              </CardContent>
            </Card>

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <Timestamp label="Created" dateString={team.createdAt!} />
              <Timestamp label="Last Updated" dateString={team.updatedAt!} />
            </div>

            <Separator />

            {/* Quick Actions */}
            <section className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Actions</h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setShowInviteForm(!showInviteForm)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Invite Member
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  View Members
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Training
                </Button>
              </div>
            </section>

            {/* Invite Form */}
            {showInviteForm && (
              <section className="bg-gray-50 rounded-md p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Invite Team Member</h4>
                <form onSubmit={handleInvite} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email" className="mb-1 font-semibold">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={inviteData.email}
                        onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role" className="mb-1 font-semibold">
                        Role <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={inviteData.role}
                        onValueChange={(value) => setInviteData((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <Button type="submit" disabled={loading} className="flex items-center gap-2">
                      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                      <Mail className="h-5 w-5" />
                      Send Invite
                    </Button>
                    <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </section>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper components for neatness:
const InfoLine: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({
  icon,
  label,
  children,
}) => (
  <div className="flex items-center gap-3 text-gray-700">
    <div className="flex items-center justify-center shrink-0 text-muted-foreground">{icon}</div>
    <div className="flex flex-col leading-tight truncate">
      <span className="font-semibold">{label}</span>
      <span className="truncate">{children}</span>
    </div>
  </div>
);

const StatRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between text-sm text-gray-600">
    <span>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const Timestamp: React.FC<{ label: string; dateString: string }> = ({ label, dateString }) => {
  const formatted = new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Calendar className="h-4 w-4" />
      <div>
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-gray-500">{formatted}</p>
      </div>
    </div>
  );
};
