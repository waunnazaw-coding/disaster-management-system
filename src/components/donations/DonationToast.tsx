'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import DonationToastItem from './DonationToastItem';
import useDonationPolling from '../../hooks/useDonationPolling';
import { DonationDto } from '../../api/donationService';

export default function DonationToast() {
  const { newDonations, removeDonation } = useDonationPolling();

  const [queue, setQueue] = useState<DonationDto[]>([]);
  const [activeDonation, setActiveDonation] = useState<DonationDto | null>(null);

  // Save timer id so we can cancel it if user dismisses manually
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Add new donations to queue
  useEffect(() => {
    if (newDonations.length > 0) {
      setQueue(prev => [...prev, ...newDonations]);
    }
  }, [newDonations]);

  // Show next donation if none active
  useEffect(() => {
    if (!activeDonation && queue.length > 0) {
      const nextDonation = queue[0];
      setActiveDonation(nextDonation);

      // Show toast
      toast.custom(
        (t) => (
          <DonationToastItem 
            donation={nextDonation} 
            onDismiss={() => {
              // Clear timer because user dismissed manually
              if (timerId) clearTimeout(timerId);
              toast.dismiss(t.id);
              removeDonation(nextDonation.id);
              setActiveDonation(null);
              setQueue(prev => prev.slice(1));
            }}
          />
        ),
        {
          id: `donation-${nextDonation.id}`,
          position: 'bottom-left',
          duration: 5000,
        }
      );

      // Start fallback timer to auto-clear
      const id = setTimeout(() => {
        // If user didn’t dismiss → clear manually
        removeDonation(nextDonation.id);
        setActiveDonation(null);
        setQueue(prev => prev.slice(1));
      }, 8000);
      setTimerId(id);
    }
  }, [queue, activeDonation, removeDonation, timerId]);

  return null;
}
