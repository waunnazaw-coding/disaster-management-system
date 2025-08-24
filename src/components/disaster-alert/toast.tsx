import React from "react";
import { GdacsDisasterAlert } from "@/components/disaster-alert/disaster-alret";

interface ToastProps {
  alert: GdacsDisasterAlert;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ alert, onClose }) => {
  return (
    <div className="max-w-sm w-full bg-red-600 text-white shadow-lg rounded-lg pointer-events-auto mb-4">
      <div className="p-4 flex justify-between items-start">
        <div>
          <p className="font-bold text-lg">{alert.eventType}</p>
          <p>{alert.impact}</p>
          <p className="text-xs mt-1">
            Severity: {alert.severity} |{" "}
            {alert.eventDate ? new Date(alert.eventDate).toLocaleTimeString() : ""}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-red-300 focus:outline-none"
          aria-label="Close notification"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
};

export default Toast;
