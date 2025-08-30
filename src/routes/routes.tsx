import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import PublicLayout from "@/components/user-layout/PublicLayout";
import AdminLayout from "../components/admin-layout/Adminlayout";
import ReliefLayout from "../components/reliefteam-layout/ReliefTeamLayout";

import DisasterEventWizard from "../pages/admin/DisasterEventWizard";
import EventDetailsPage from "@/pages/disaster/EventDetails";
import DisasterEventUpdatePage from "@/pages/admin/DisasterEventUpdatePage";
import EventDetailsPageForAdmin from "@/pages/admin/EventDetailsPageForAdmin";
import DisasterEventsForAdmin from "@/pages/admin/EventsPageForAdimin";
import DisasterReportList from "../components/disaster/DisasterReportList";
import DisasterReportDetail from "@/components/disaster/DisasterReportDetail";
import MapLayout from "@/Map/MapLayout";
import UserProfile from "@/pages/user/Profile";
import DonationManagement from "@/components/admin-layout/DonationManagement";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import ProtectedRoute from "./ProtectedRoute";
import ReliefDashboard from "@/pages/relief/ReliefDashboard";
import AdminRequestsPage from "@/pages/admin/requests";
import { RequestFormPage } from "../pages/disaster/AssistantRequestForm";
import { NotificationsPage } from "@/pages/NotificationPage";
import { AdminAssignmentsPage } from "@/pages/admin/AssignmentsPage";
import { ReliefAssignmentsPage } from "@/pages/relief/ReliefAssignmentsPage";
import { AssignRequestsToReliefPage } from "@/pages/admin/AssignRequestsToReliefPage";
import { ResetPasswordForm } from "@/components/auth/ResetPassword";
import { AdminInviteForm } from "@/components/admin-layout/AdminInviteForm";
import { AcceptFinancialAdminInviteForm } from "@/components/admin-layout/AcceptFinancialAdminForm";
import EmergencyContact from "@/components/emergency/EmergencyContact";
import RequestDetailsPage from "@/pages/user/RequestDetailsPage";
import ActivityPage from "@/pages/admin/AdminActivityPage";
import ReliefActivityPage from "@/pages/relief/ReliefActivityPage";
import AwarenessPage from "@/pages/awareness/awareness-page";
import DonationPage from "@/pages/donation/Donation";
import FinancialReportsPage from "@/pages/finanacial-reports/financial-reports-page";
import MapView from "@/components/disaster/DisasterEventMap";
import MapPublicLayout from "@/Map/MapPublicLayout";
import { PartnersPage } from "@/pages/admin/partnersPage";
import ContactUs from "@/pages/ContactUs";
import { AdminContactManagement } from "@/components/admin-layout/AdminContactManagement";
import ActivitiesPage from "@/pages/public/ActivitiesPage";
import { ActivityDetailPage } from "@/pages/public/ActivityDetailPage";

import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUpPage";
import Unauthorized from "../pages/Unauthorized";
import HomePage from "@/pages/HomePage";
import DisasterEventPage from "../pages/disaster/DisasterEventsPage";
import DisasterReportWizard from "../pages/disaster/DIsasterReportWizard";
import AssistantRequestPage from "@/pages/disaster/AssistantRequestPage";
import ReliefTeamListPage from "@/pages/relief/ReliefTeamListPage";
import DonationFormPage from "@/pages/donation/DonationForm";
import VolunteerForm from "@/pages/donation/VolunteerForm";
import AboutUsPage from "@/pages/AboutUs";
import AdminDashboard from "../pages/admin/Dashboard";
import DisasterDashboard from "@/pages/disaster/disaster-map";
import ImpactSurveyPage from "@/pages/disaster/impact-survey";
import AdminDashboardRedirect from "@/components/admin-layout/AdminDashboardRedirect";
import { FinancialAdminInviteForm } from "@/components/admin-layout/admin/FinancialAdminInvite";
import { AcceptDisasterAdminInviteForm } from "@/components/admin-layout/AcceptDisasterAdminForm";

// Loading fallback UI (for Suspense boundaries)
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-lg">Loading...</div>
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
);

const router = createBrowserRouter([
  // Public authentication routes (no layout)
  {
    path: "/signup",
    element: withSuspense(<SignUp />),
  },
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/reset-password",
    element: withSuspense(<ResetPasswordForm />),
  },
  {
    path: "/accept-financial-admin-invite",
    element: <AcceptFinancialAdminInviteForm />,
  },
  {
    path: "/accept-disaster-admin-invite",
    element: <AcceptDisasterAdminInviteForm />,
  },
  {
    path: "/unauthorized",
    element: withSuspense(<Unauthorized />),
  },

  // Public routes nested under PublicLayout
  {
    path: "/",
    element: withSuspense(<PublicLayout />),
    children: [
      { index: true, element: <HomePage /> },
      { path: "disasters", element: <DisasterEventPage /> },
      { path: "awareness", element: <AwarenessPage /> },
      { path: "disasters/report", element: <DisasterReportWizard /> },
      { path: "disasters/:id", element: <EventDetailsPage /> },
      { path: "disasters/impact-survey", element: <ImpactSurveyPage /> },
      {
        path: "requests",
        children: [
          { path: "assistant", element: <AssistantRequestPage /> },
          { path: "assistant/new", element: <RequestFormPage /> },
          {
            path: "assistant/edit/:id",
            element: (
              <ProtectedRoute
                allowedRoles={["User", "Admin", "SysAdmin", "ReliefTeam", "Org"]}
              >
                <RequestFormPage editMode={true} />
              </ProtectedRoute>
            ),
          },
          {
            path: "assistant/:id",
            element: (
              <ProtectedRoute
                allowedRoles={["User", "Admin", "SysAdmin", "ReliefTeam", "Org"]}
              >
                <RequestDetailsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      { path: "teams/relief", element: <ReliefTeamListPage /> },
      { path: "events/mapView", element: <MapPublicLayout />, },
      { path: "donations", element: <DonationPage /> },
      { path: "donations/new", element: <DonationFormPage /> },
      { path: "volunteers/apply", element: <VolunteerForm /> },
      { path: "about", element: <AboutUsPage /> },
      {
        path: "notifications",
        element: (
          <ProtectedRoute allowedRoles={["User", "Admin", "SysAdmin", "ReliefTeam", "Org"]}>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute allowedRoles={["User", "Admin", "SysAdmin", "ReliefTeam", "Org"]} />
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <UserProfile />
              </Suspense>
            ),
          },

          { path: "requests/assistant", element: <AssistantRequestPage /> },
          { path: "teams/relief", element: <ReliefTeamListPage /> },
          { path: "donations/new", element: <DonationFormPage /> },
          { path: "volunteers/apply", element: <VolunteerForm /> },
          { path: "about", element: <AboutUsPage /> },
        ],
      },
      { path: "emergency-contacts", element: <EmergencyContact /> },
      { path: "activities", element: <ActivitiesPage /> },
      { path: "activities/:id", element: <ActivityDetailPage /> },
    ],
  },

  // Admin protected routes
  {
    element: <ProtectedRoute allowedRoles={["Admin", "SysAdmin", "DisasterManagementAdmin", "FinancialAdmin"]} />,
    children: [
      {
        element: withSuspense(<AdminLayout />),
        children: [
          {
            path: "admin/dashboard",
            element: <AdminDashboardRedirect />
          },
          // { path: "admin/dashboard", element: <AdminDashboard /> },
          { path: "admin/events", element: <DisasterEventsForAdmin /> },
          { path: "admin/gdacs-events", element: <DisasterDashboard /> },
          { path: "admin/events/new", element: <DisasterEventWizard /> },
          { path: "admin/events/update/:id", element: <DisasterEventUpdatePage /> },
          { path: "admin/events/:id", element: <EventDetailsPageForAdmin /> },
          { path: "admin/reports", element: <DisasterReportList /> },
          { path: "admin/reports/:id", element: <DisasterReportDetail /> },
          {
            path: "admin/mapView",
            element: <MapLayout />, // no children needed
          },


        ],
      },
    ],
  },
  // Public routes nested under PublicLayout
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <HomePage /> },

      { path: "disasters", element: <DisasterEventPage /> },

      { path: "requests/assistant", element: <AssistantRequestPage /> },
      //{ path: "requests/assistant/new", element: <AssistantRequestForm /> },

      { path: "teams/relief", element: <ReliefTeamListPage /> },

      { path: "donations/new", element: <DonationFormPage /> },

      { path: "volunteers/apply", element: <VolunteerForm /> },

      { path: "emergency-contacts", element: <EmergencyContact /> },

      { path: "about", element: <AboutUsPage /> },
      { path: "contact", element: <ContactUs /> },
      // New activity routes
      { path: "activities", element: <ActivitiesPage /> },
      { path: "activities/:id", element: <ActivityDetailPage /> },
    ],
  },

  // Admin protected routes
  {
    element: <ProtectedRoute allowedRoles={["SysAdmin", "DisasterManagementAdmin", "FinancialAdmin"]} />,
    children: [
      {
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          // { path: "admin/dashboard", element: <AdminDashboard /> },

          {
            path: "admin/dashboard",
            element: <AdminDashboardRedirect />
          },
          { path: "admin/relief-team-lists", element: <ReliefTeamListPage /> },
          { path: "admin/disaster-management-admin-invite", element: <AdminInviteForm /> },
          { path: "admin/financial-admin-invite", element: <FinancialAdminInviteForm /> },
          { path: "admin/donations", element: <DonationManagement /> },
          { path: "admin/users", element: <UserManagementPage /> },
          { path: "admin/requests", element: <AdminRequestsPage /> },
          { path: "admin/assignments", element: <AdminAssignmentsPage /> },
          { path: "admin/assign-request/:id", element: <AssignRequestsToReliefPage /> },
          { path: "admin/activity", element: <ActivityPage /> },
          { path: "admin/financial-reports", element: <FinancialReportsPage /> },
          { path: "admin/financial-reports", element: <FinancialReportsPage /> },
          // ... other routes
          { path: "admin/partners", element: <PartnersPage /> },
          { path: "admin/contacts", element: <AdminContactManagement /> }
        ],
      },
    ],
  },

  // ReliefTeam protected routes
  {
    element: <ProtectedRoute allowedRoles={["ReliefTeam"]} />,
    children: [
      {
        element: withSuspense(<ReliefLayout />),
        children: [
          { path: "relief/dashboard", element: <ReliefDashboard /> },
          { path: "relief/assignments", element: <ReliefAssignmentsPage /> },
          { path: "relief/activities", element: <ReliefActivityPage /> },
        ],
      },
    ],
  },

  // Catch-all 404 fallback route
  {
    path: "*",
    element: <h2 className="text-center mt-20 text-2xl">404: Page Not Found</h2>,
  },
]);

export default router;
