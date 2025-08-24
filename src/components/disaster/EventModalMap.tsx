import React from "react";

interface EventModalProps {
  event: any;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold">{event.name || "Disaster Event"}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            ✖
          </button>
        </div>
        <div className="p-3 space-y-3">
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${event.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {event.status || "CaseClosed"}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
              {event.disasterTypeName || "Unknown"}
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
              {event.severity}
            </span>
          </div>

          {event.description && (
            <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-2">
              {event.description}
            </p>
          )}

          <div className="flex justify-between items-center text-xs text-blue-500">
            <div>
              <div className="font-semibold text-blue-800">
                {event.createdUserName || "Unknown"}
              </div>
              <div className="text-gray-500">
                {event.createdAt
                  ? new Date(event.createdAt).toLocaleString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
