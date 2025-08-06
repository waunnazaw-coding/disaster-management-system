// // src/components/assignments/AssignRequestForm/TeamSelectionGrid.tsx
// import { ReliefTeamDto } from "@/types/reliefTeam";
// import { TeamSelectionCard } from "./TeamSelectionCard";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// interface TeamSelectionGridProps {
//   teams: ReliefTeamDto[];
//   selectedTeamId: number | null;
//   onTeamSelect: (teamId: number) => void;
//   searchTerm: string;
//   onSearchChange: (term: string) => void;
// }

// export const TeamSelectionGrid = ({
//   teams,
//   selectedTeamId,
//   onTeamSelect,
//   searchTerm,
//   onSearchChange,
// }: TeamSelectionGridProps) => {
//   const filteredTeams = teams.filter(team =>
//     team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     team.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     team.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-4">
//       <div className="relative">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search teams by name, specialization or location..."
//           className="pl-9"
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//         />
//       </div>
      
//       {filteredTeams.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredTeams.map((team) => (
//             <TeamSelectionCard
//               key={team.id}
//               team={team}
//               selected={selectedTeamId === team.id}
//               onSelect={() => onTeamSelect(team.id)}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8 text-muted-foreground">
//           <p>No relief teams found matching your search.</p>
//           {searchTerm && (
//             <button
//               onClick={() => onSearchChange("")}
//               className="text-primary underline mt-2"
//             >
//               Clear search
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// src/pages/admin/AssignRequestPage/components/TeamSelectionGrid.tsx
import { ReliefTeamDto } from "@/types/reliefTeam";
import { TeamSelectionCard } from "./TeamSelectionCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getReliefTeams } from "@/api/reliefTeam";

interface TeamSelectionGridProps {
  selectedTeamId: number | null;
  onTeamSelect: (teamId: number) => void;
}

export const TeamSelectionGrid = ({
  selectedTeamId,
  onTeamSelect,
}: TeamSelectionGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<ReliefTeamDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const data = await getReliefTeams();
        setTeams(data);
        setError(null);
      } catch (err) {
        setError("Failed to load relief teams. Please try again later.");
        console.error("Error fetching relief teams:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams by name, specialization or location..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeams.map((team) => (
            <TeamSelectionCard
              key={team.id}
              team={team}
              selected={selectedTeamId === team.id}
              onSelect={() => onTeamSelect(team.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No relief teams found matching your search.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-primary underline mt-2"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};