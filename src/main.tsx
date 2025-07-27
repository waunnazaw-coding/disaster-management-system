import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "leaflet/dist/leaflet.css";
import RootLayout from "./pages/RootLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <RootLayout />
  </StrictMode>
);