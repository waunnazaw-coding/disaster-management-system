import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

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
import { AcceptAdminInviteForm } from "@/components/admin-layout/AcceptAdminForm";
import EmergencyContact from "@/components/emergency/EmergencyContact";
import RequestDetailsPage from "@/pages/user/RequestDetailsPage";
import ActivityPage from "@/pages/admin/AdminActivityPage";
import ReliefActivityPage from "@/pages/relief/ReliefActivityPage";

const PublicLayout = lazy(
  () => import("@/components/user-layout/PublicLayout")
);
const AdminLayout = lazy(
  () => import("../components/admin-layout/Adminlayout")
);
const ReliefLayout = lazy(
  () => import("../components/reliefteam-layout/ReliefTeamLayout")
);
import AwarenessPage from "@/pages/awareness/awareness-page";
import DonationPage from "@/pages/donation/Donation";
import FinancialAllocationsPage from "@/pages/finanacial-reports/financial-reports-page";
import FinancialReportsPage from "@/pages/finanacial-reports/financial-reports-page";
import { PartnersPage } from "@/pages/admin/partnersPage";
import ContactUs from "@/pages/ContactUs";
import { AdminContactManagement } from "@/components/admin-layout/AdminContactManagement";
import ActivitiesPage from "@/pages/public/ActivitiesPage";
import { ActivityDetailPage } from "@/pages/public/ActivityDetailPage";

// Lazy loaded pages
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUpPage"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const DisasterEventPage = lazy(
  () => import("../pages/disaster/DisasterEventsPage")
);
const DisasterReportForm = lazy(
  () => import("../pages/disaster/DisasterReportForm")
);
const AssistantRequestPage = lazy(
  () => import("@/pages/disaster/AssistantRequestPage")
);
const ReliefTeamListPage = lazy(
  () => import("@/pages/relief/ReliefTeamListPage")
);
const DonationFormPage = lazy(() => import("@/pages/donation/DonationForm"));
const VolunteerForm = lazy(() => import("@/pages/donation/VolunteerForm"));
const AboutUsPage = lazy(() => import("@/pages/AboutUs"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));

// Loading fallback UI
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-lg">Loading...</div>
  </div>
);

const router = createBrowserRouter([
  // Public authentication routes (no layout)
  {
    path: "/signup",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },

  {
    path: "/reset-password",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordForm />
      </Suspense>
    ),
  },

  {
    path: "/accept-invite",
    element: <AcceptAdminInviteForm />,
  },
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Unauthorized />
      </Suspense>
    ),
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
      // Home page - always accessible
      {
        index: true,
        element: <HomePage />,
      },
      { path: "disasters", element: <DisasterEventPage /> },
      { path: "awareness", element: <AwarenessPage /> },
      { path: "disasters/report", element: <DisasterReportForm /> },
      {
        path: "requests",
        children: [
          {
            path: "assistant",
            element: <AssistantRequestPage />,
          },
          {
            path: "assistant/new",
            element: <RequestFormPage />,
          },
          {
            path: "assistant/edit/:id",
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "User",
                  "Admin",
                  "SysAdmin",
                  "ReliefTeam",
                  "Org",
                ]}
              >
                <RequestFormPage editMode={true} />
              </ProtectedRoute>
            ),
          },
          {
            path: "assistant/:id",
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "User",
                  "Admin",
                  "SysAdmin",
                  "ReliefTeam",
                  "Org",
                ]}
              >
                <RequestDetailsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      { path: "teams/relief", element: <ReliefTeamListPage /> },
      { path: "donations", element: <DonationPage /> },
      { path: "volunteers/apply", element: <VolunteerForm /> },
      { path: "about", element: <AboutUsPage /> },
      // Notifications page
      {
        path: "notifications",
        element: (
          <ProtectedRoute
            allowedRoles={["User", "Admin", "SysAdmin", "ReliefTeam", "Org"]}
          >
            <Suspense fallback={<LoadingFallback />}>
              <NotificationsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // Profile page - protected route for authenticated users
      {
        path: "profile",
        element: (
          <ProtectedRoute
            allowedRoles={["User", "Admin", "SysAdmin", "ReliefTeam", "Org"]}
          />
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
      { path: "disasters/report", element: <DisasterReportForm /> },

      { path: "requests/assistant", element: <AssistantRequestPage /> },
      //{ path: "requests/assistant/new", element: <AssistantRequestForm /> },

      { path: "teams/relief", element: <ReliefTeamListPage /> },

      { path: "donations/new", element: <DonationFormPage /> },

      { path: "volunteers/apply", element: <VolunteerForm /> },

      { path: "emergency-contacts", element: <EmergencyContact /> },

      { path: "about", element: <AboutUsPage /> },
      {path: "contact", element: <ContactUs />},
      // New activity routes
      { path: "activities", element: <ActivitiesPage /> },
      { path: "activities/:id", element: <ActivityDetailPage /> },
    ],
  },

  // Admin protected routes
  {
    element: <ProtectedRoute allowedRoles={["Admin", "SysAdmin"]} />,
    children: [
      {
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          { path: "admin/dashboard", element: <AdminDashboard /> },
          { path: "admin/relief-team-lists", element: <ReliefTeamListPage /> },
          { path: "admin/admin-invite", element: <AdminInviteForm /> },
          { path: "admin/dashboard", element: <AdminDashboard /> },
          { path: "admin/donations", element: <DonationManagement /> },
          { path: "admin/users", element: <UserManagementPage /> },
          { path: "admin/requests", element: <AdminRequestsPage /> },
          { path: "admin/assignments", element: <AdminAssignmentsPage /> },
          {
            path: "admin/assign-request/:id",
            element: <AssignRequestsToReliefPage />,
          },
          { path: "admin/activity", element: <ActivityPage /> },
           { path: "admin/financial-reports", element: <FinancialReportsPage /> },
             // ... other routes
        { path: "admin/partners", element: <PartnersPage /> },
        {path:"admin/contacts", element: <AdminContactManagement />}
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["ReliefTeam"]} />,
    children: [
      {
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ReliefLayout />
          </Suspense>
        ),
        children: [
          { path: "relief/dashboard", element: <ReliefDashboard /> },
          { path: "relief/assignments", element: <ReliefAssignmentsPage /> },
          { path: "relief/actvities", element: <ReliefActivityPage /> },
        ],
      },
    ],
  },
  // Catch-all 404 fallback route
  {
    path: "*",
    element: (
      <h2 className="text-center mt-20 text-2xl">404: Page Not Found</h2>
    ),
  },
]);

export default router;
