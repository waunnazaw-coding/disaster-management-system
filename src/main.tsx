import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootLayout from "./pages/RootLayout";
// Add Leaflet CSS import here
import "leaflet/dist/leaflet.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootLayout />
  </StrictMode>,
);
