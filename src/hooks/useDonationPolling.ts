// src/hooks/useDonationPolling.ts
import { useEffect, useState } from 'react';
import { donationService, type DonationDto } from '../api/donationService';

export default function useDonationPolling(interval = 30000) {
  const [lastDonationId, setLastDonationId] = useState<number | null>(null);
  const [newDonations, setNewDonations] = useState<DonationDto[]>([]);

  const checkForNewDonations = async () => {
    try {
      const donations = await donationService.getRecentDonations();
      if (donations.length > 0) {
        const latestDonation = donations[0];
        
        // Only return new donations we haven't seen before
        if (latestDonation.id !== lastDonationId) {
          setLastDonationId(latestDonation.id);
          return donations.filter(d => lastDonationId === null || d.id > lastDonationId);
        }
      }
      return [];
    } catch (error) {
      console.error("Error checking for donations:", error);
      return [];
    }
  };

  useEffect(() => {
    // Initial check
    checkForNewDonations().then(donations => {
      if (donations.length > 0) {
        setNewDonations(prev => [...donations, ...prev]);
      }
    });

    // Set up interval
    const timer = setInterval(async () => {
      const donations = await checkForNewDonations();
      if (donations.length > 0) {
        setNewDonations(prev => [...donations, ...prev]);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval, lastDonationId]);

  const removeDonation = (id: number) => {
    setNewDonations(prev => prev.filter(d => d.id !== id));
  };

  return { newDonations, removeDonation };
}