"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { FileText, HandHeart, Gift, Bell, Shield } from "lucide-react"
import ProfileCard from "../../components/user-layout/ProfileCard"
import ReportsTab from "../../components/user-layout/tabs/ReportsTab"

import type { User, DisasterReport, AssistanceRequest, Donation, Notification } from "@/types/user"
import RequestsTab from "@/components/user-layout/tabs/RequestsTab"
import DonationsTab from "@/components/user-layout/tabs/DonationsTab"
import NotificationsTab from "@/components/user-layout/tabs/NotificationTab"
import SecurityTab from "@/components/user-layout/tabs/SecurityTab"

// Mock data - replace with actual API calls
const mockUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Aye Thida Aung",
  email: "aye@gmail.com",
  //phone: "+9591234567",
  role: "User",
  status: "Active",
  createdAt: "2023-01-15T08:30:00Z",
  //profilePhoto: "/professional-headshot.png",
}

const mockReports: DisasterReport[] = [
  {
    id: 1,
    title: "Flooding in Downtown Area",
    type: "Flood",
    severity: "High",
    status: "Verified",
    createdAt: "2024-01-15T10:30:00Z",
    description: "Severe flooding affecting main roads and residential areas",
  },
  {
    id: 2,
    title: "Building Collapse Risk",
    type: "Structural Damage",
    severity: "Critical",
    status: "Pending",
    createdAt: "2024-01-14T14:20:00Z",
    description: "Old building showing signs of structural damage after earthquake",
  },
]

const mockRequests: AssistanceRequest[] = [
  {
    id: 1,
    supportType: "Medical Supplies",
    quantity: 50,
    unit: "units",
    priority: "High",
    status: "InProgress",
    createdAt: "2024-01-15T09:00:00Z",
    description: "Urgent need for first aid kits and bandages",
  },
  {
    id: 2,
    supportType: "Food Packages",
    quantity: 100,
    unit: "packages",
    priority: "Medium",
    status: "Fulfilled",
    createdAt: "2024-01-12T16:45:00Z",
    description: "Emergency food supplies for displaced families",
  },
]

const mockDonations: Donation[] = [
  {
    id: 1,
    type: "Cash",
    quantity: 0,
    unit: "",
    amount: 500,
    currency: "USD",
    status: "Distributed",
    dateReceived: "2024-01-10T12:00:00Z",
    description: "Emergency relief fund donation",
  },
  {
    id: 2,
    type: "Clothing",
    quantity: 25,
    unit: "items",
    status: "Verified",
    dateReceived: "2024-01-08T14:30:00Z",
    description: "Winter clothing for disaster victims",
  },
]

const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "Your disaster report #1 has been verified by our team",
    type: "success",
    isRead: false,
    createdAt: "2024-01-15T11:00:00Z",
    relatedEntityId: 1,
  },
  {
    id: 2,
    message: "Your assistance request #1 is now in progress",
    type: "info",
    isRead: false,
    createdAt: "2024-01-15T09:30:00Z",
    relatedEntityId: 1,
  },
  {
    id: 3,
    message: "Thank you for your donation! It has been distributed successfully",
    type: "success",
    isRead: true,
    createdAt: "2024-01-10T15:00:00Z",
    relatedEntityId: 1,
  },
]

export default function ProfilePage() {
  const [reports, setReports] = useState<DisasterReport[]>(mockReports)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("reports")

  // In a real app, you would fetch data from your API here
  useEffect(() => {
    // fetchUserProfile();
    // fetchUserReports();
    // fetchUserRequests();
    // fetchUserDonations();
    // fetchUserNotifications();
  }, [])

  const handleEditProfile = () => {
    // Navigate to edit profile page or open modal
    console.log("Edit profile clicked")
  }

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <ProfileCard onEditProfile={handleEditProfile} />

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
              <span className="sm:hidden">📑</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <HandHeart className="h-4 w-4" />
              <span className="hidden sm:inline">Requests</span>
              <span className="sm:hidden">🆘</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Donations</span>
              <span className="sm:hidden">🎁</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 relative">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">🔔</span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">🔑</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <ReportsTab reports={reports} />
          </TabsContent>

          <TabsContent value="requests">
    <RequestsTab />
          </TabsContent>

          <TabsContent value="donations">
            <DonationsTab  />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
