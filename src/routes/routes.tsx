import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import DisasterEventWizard from "../pages/admin/DisasterEventWizard";
import DisasterEventList from "@/components/disaster/DisasterEventLists";

const PublicLayout = lazy(() => import("@/components/user-layout/PublicLayout"));
const AdminLayout = lazy(() => import("../components/admin-layout/Adminlayout"));
const ReliefLayout = lazy(() => import("../components/reliefteam-layout/ReliefTeamLayout"));

// Lazy loaded pages
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUpPage"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));

const HomePage = lazy(() => import("@/pages/HomePage"));
const DisasterEventPage = lazy(() => import("../pages/disaster/DisasterEventsPage"));
const DisasterReportForm = lazy(() => import("../pages/disaster/DisasterReportForm"));
const AssistantRequestPage = lazy(() => import("@/pages/disaster/AssistantRequestPage"));
const AssistantRequestForm = lazy(() => import("../pages/disaster/AssistantRequestForm"));
const ReliefTeamListPage = lazy(() => import("@/pages/relief/ReliefTeamListPage"));
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
            { index: true, element: <HomePage /> },

            { path: "disasters", element: <DisasterEventPage /> },
            { path: "disasters/report", element: <DisasterReportForm /> },
            { path: "disasters/lists", element: <DisasterEventList /> },

            { path: "requests/assistant", element: <AssistantRequestPage /> },
            { path: "requests/assistant/new", element: <AssistantRequestForm /> },

            { path: "teams/relief", element: <ReliefTeamListPage /> },

            { path: "donations/new", element: <DonationFormPage /> },

            { path: "volunteers/apply", element: <VolunteerForm /> },

            { path: "about", element: <AboutUsPage /> },
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
                    { path: "admin/events", element: <DisasterEventPage /> },
                    { path: "admin/events/new", element: <DisasterEventWizard /> },
                ],
            },
        ],
    },

    // Relief protected routes
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
                    // Add relief team routes here
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
