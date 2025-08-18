"use client";

import React, { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
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
        error instanceof Error ? error.message : `Failed to ${team ? "update" : "create"} team`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto rounded-lg p-6 bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {team ? "Edit Relief Team" : "Create New Relief Team"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1 mb-6">
            {team
              ? "Update the team details below"
              : "Fill in the details to create a new relief team"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <section className="bg-gray-50 p-4 rounded-md shadow-inner">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-4">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="block mb-1 font-semibold text-gray-800">
                  Team Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter team name"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <Label htmlFor="teamLeaderName" className="block mb-1 font-semibold text-gray-800">
                  Team Leader Name *
                </Label>
                <Input
                  id="teamLeaderName"
                  value={formData.teamLeaderName}
                  onChange={(e) => handleChange("teamLeaderName", e.target.value)}
                  placeholder="Enter team leader name"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="contactInfo" className="block mb-1 font-semibold text-gray-800">
                Contact Information *
              </Label>
              <Textarea
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => handleChange("contactInfo", e.target.value)}
                placeholder="Describe how to contact this team"
                rows={3}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="specialization" className="block mb-1 font-semibold text-gray-800">
                  Specialization *
                </Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleChange("specialization", value)}
                  required
                >
                  <SelectTrigger className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Natural Disasters">Natural Disasters</SelectItem>
                    <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                    <SelectItem value="Search & Rescue">Search & Rescue</SelectItem>
                    <SelectItem value="Fire Emergency">Fire Emergency</SelectItem>
                    <SelectItem value="Water Rescue">Water Rescue</SelectItem>
                    <SelectItem value="Chemical Hazards">Chemical Hazards</SelectItem>
                    <SelectItem value="Urban Rescue">Urban Rescue</SelectItem>
                    <SelectItem value="Flood Response">Flood Response</SelectItem>
                    <SelectItem value="Earthquake Response">Earthquake Response</SelectItem>
                    <SelectItem value="Cyclone Response">Cyclone Response</SelectItem>
                    <SelectItem value="Landslide Response">Landslide Response</SelectItem>
                    <SelectItem value="Community Outreach">Community Outreach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Location Information Section */}
          <section className="bg-gray-50 p-4 rounded-md shadow-inner">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-4">
              Location Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="numberOfMembers" className="block mb-1 font-semibold text-gray-800">
                  Number of Members
                </Label>
                <Input
                  id="numberOfMembers"
                  type="number"
                  min={1}
                  value={formData.numberOfMembers}
                  onChange={(e) => handleChange("numberOfMembers", e.target.value)}
                  placeholder="Enter number of members"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="address" className="block mb-1 font-semibold text-gray-800">
                Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter full address"
                rows={3}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>

          {/* Contact Details Section */}
          <section className="bg-gray-50 p-4 rounded-md shadow-inner">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-4">
              Contact Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="block mb-1 font-semibold text-gray-800">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="block mb-1 font-semibold text-gray-800">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="socialMediaURL" className="block mb-1 font-semibold text-gray-800">
                Social Media URL
              </Label>
              <Input
                id="socialMediaURL"
                type="url"
                value={formData.socialMediaURL}
                onChange={(e) => handleChange("socialMediaURL", e.target.value)}
                placeholder="Enter social media URL"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>

          {/* Additional Information Section */}
          <section className="bg-gray-50 p-4 rounded-md shadow-inner">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-4">
              Additional Information
            </h4>

            <div className="mb-6">
              <Label htmlFor="equipmentDetails" className="block mb-1 font-semibold text-gray-800">
                Equipment Details
              </Label>
              <Textarea
                id="equipmentDetails"
                value={formData.equipmentDetails}
                onChange={(e) => handleChange("equipmentDetails", e.target.value)}
                placeholder="Describe available equipment and resources"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="establishedDate" className="block mb-1 font-semibold text-gray-800">
                Established Date
              </Label>
              <Input
                id="establishedDate"
                type="date"
                value={formData.establishedDate}
                onChange={(e) => handleChange("establishedDate", e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-6 flex items-center justify-center">
              {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {team ? "Update Team" : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
