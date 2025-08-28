



"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { FileText, HandHeart, Gift, Shield } from "lucide-react"
import ProfileCard from "../../components/user-layout/ProfileCard"
import ReportsTab from "../../components/user-layout/tabs/ReportsTab"
import RequestsTab from "@/components/user-layout/tabs/RequestsTab"
import DonationsTab from "@/components/user-layout/tabs/DonationsTab"
import SecurityTab from "@/components/user-layout/tabs/SecurityTab"

import type { User } from "@/types/user"

// ---------------- Mock Data ----------------




// ---------------- Main Component ----------------
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("requests")

  useEffect(() => {
    // Normally fetch user data here
  }, [])

  const handleEditProfile = () => {
    console.log("Edit profile clicked")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Profile Card */}
        <ProfileCard onEditProfile={handleEditProfile} />

        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              {/* <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </TabsTrigger> */}
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <HandHeart className="h-4 w-4" />
                <span>Requests</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span>Donations</span>
              </TabsTrigger>
              {/* <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger> */}
            </TabsList>

            {/* Unified Content Styling */}
            {/* <TabsContent value="reports">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <ReportsTab reports={reports} />
              </div>
            </TabsContent> */}

            <TabsContent value="requests">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <RequestsTab />
              </div>
            </TabsContent>

            <TabsContent value="donations">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <DonationsTab />
              </div>
            </TabsContent>

            {/* <TabsContent value="security">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <SecurityTab />
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
