// components/DonationToast.tsx
"use client"

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Banknote, Package, X } from "lucide-react";
import { donationService, type DonationDto } from "../../api/donationService";

export default function DonationToast() {
  const [lastDonationId, setLastDonationId] = useState<number | null>(null);

  useEffect(() => {
    const checkForNewDonations = async () => {
      try {
        const donations = await donationService.getRecentDonations();
        if (donations.length > 0) {
          const latestDonation = donations[0];
          
          // Only show toast if it's a new donation
          if (latestDonation.id !== lastDonationId) {
            showDonationToast(latestDonation);
            setLastDonationId(latestDonation.id);
          }
        }
      } catch (error) {
        console.error("Error checking for donations:", error);
      }
    };

    // Check immediately on mount
    checkForNewDonations();

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkForNewDonations, 30000);

    return () => clearInterval(interval);
  }, [lastDonationId]);

  const showDonationToast = (donation: DonationDto) => {
    toast.custom((t) => (
      <div className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-300 ${t.visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {donation.type === "Money" ? (
                <Banknote className="h-10 w-10 text-green-500" />
              ) : (
                <Package className="h-10 w-10 text-blue-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                New {donation.type.toLowerCase()} donation!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {donation.donorName || "Anonymous"} donated{" "}
                {donation.type === "Money" 
                  ? `${donation.currency} ${donation.amount?.toLocaleString()}` 
                  : `${donation.quantity} ${donation.unit}`}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(donation.dateReceived || new Date()).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    ), {
      position: "bottom-left",
      duration: 50000,
    });
  };

  return null;
}