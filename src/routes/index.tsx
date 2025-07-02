import { createBrowserRouter } from "react-router-dom"
import Layout from "../components/layout/Layout"
import HomePage from "../pages/HomePage"
import EventDetailsPage from "../pages/EventDetailsPage"
import MyReportsPage from "../pages/MyReportsPage"
import HelpCenterPage from "../pages/HelpCenterPage"
import { DonatePage } from "../pages/DonatePage"
import { ReportDisasterPage } from "../pages/ReportDisasterPage"
import DisasterEventsPage from "../pages/DisasterEventsPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "events",
        element: <DisasterEventsPage/>,
      },
      {
        path: "events/:id",
        element: <EventDetailsPage />,
      },
      {
        path: "report",
        element: <ReportDisasterPage />,
      },
      {
        path: "my-reports",
        element: <MyReportsPage />,
      },
      {
        path: "donate",
        element: <DonatePage />,
      },
      {
        path:"helpcenter",
        element:<HelpCenterPage/>
      }
    ],
  },
])
