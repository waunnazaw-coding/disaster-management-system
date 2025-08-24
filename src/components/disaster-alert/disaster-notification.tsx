import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/store/authStore"; // Adjust path as needed

const DisasterNotification: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticatedFn());

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    // Only proceed if authenticated and user role is exactly "Admin" (case insensitive)
    if (!isAuthenticated || !user || user.role.toLowerCase() !== "admin") {
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7148/disasterNotifications") 
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("SignalR Connected.");
        // Register role as "Admin" with capital A
        return newConnection.invoke("RegisterRole", "Admin");
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    newConnection.on("ReceiveDisasterUpdate", (eventData) => {
      console.log("Disaster update received:", eventData);
      toast.info(`New Disaster Alert: ${eventData.description}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    return () => {
      newConnection.off("ReceiveDisasterUpdate");
      newConnection.stop();
    };
  }, [isAuthenticated, user]);

  return <ToastContainer />;
};

export default DisasterNotification;
