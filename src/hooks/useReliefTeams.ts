import { getReliefTeams } from '@/api/reliefTeam';
import { ReliefTeamDto } from '@/types/reliefTeam';
import { useEffect, useState } from 'react';

export function useReliefTeams() {
  const [reliefTeams, setReliefTeams] = useState<ReliefTeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getReliefTeams();
      setReliefTeams(data);
    } catch (err) {
      setError('Failed to fetch relief teams');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { reliefTeams, loading, error, refetch: fetchTeams };
}