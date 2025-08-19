import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";
import Toast from "@/components/disaster-alert/toast";
export interface GdacsDisasterAlert {
  eventId: string;
  eventType?: string;
  severity?: string;
  eventDate?: string;  // ISO string format
  latitude?: number;
  longitude?: number;
  impact?: string;
  status?: string;
}


const DisasterAlerts: React.FC = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [toasts, setToasts] = useState<GdacsDisasterAlert[]>([]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7148/disasterNotifications") // Replace with your backend URL
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR Connected.");
          connection.on("ReceiveDisasterUpdate", (alert: unknown) => {
            // Type cast alert to GdacsDisasterAlert safely
              const gdacsAlert = alert as GdacsDisasterAlert;
              
              console.log(gdacsAlert)

            setToasts((prev) => [...prev, gdacsAlert]);

            // Remove toast after 7 seconds
            setTimeout(() => {
              setToasts((current) =>
                current.filter((t) => t.eventId !== gdacsAlert.eventId)
              );
            }, 7000);
          });
        })
        .catch((err) => console.error("SignalR connection error: ", err));
    }

    return () => {
      connection?.stop();
    };
  }, [connection]);

  const removeToast = (eventId: string) => {
    setToasts((current) => current.filter((t) => t.eventId !== eventId));
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.eventId}
            alert={toast}
            onClose={() => removeToast(toast.eventId)}
          />
        ))}
      </div>
    </>
  );
};

export default DisasterAlerts;
