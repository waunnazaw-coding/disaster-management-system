import { authService } from "@/api/auth"; // Your authService path
import { useAdminStore } from "@/store/adminStore"; // Admin store path
//import { useUserStore } from "@/store/userStore"; // User store if any
import type { NavigateFunction } from "react-router-dom";

export async function globalLogout(navigate: NavigateFunction) {
  try {
    // Call backend logout & clear tokens
    await authService.logout();

    // Clear Zustand or Context global auth/user states here if you use separate stores
    useAdminStore.getState().setLoading(true);
    useAdminStore.setState({ currentUser: null });
    useAdminStore.setState({ sidebarCollapsed: false });

    // Redirect to home page ("/")
    navigate("/");
  } catch (error) {
    console.error("Global logout failed:", error);
  } finally {
    useAdminStore.getState().setLoading(false);
  }
}
