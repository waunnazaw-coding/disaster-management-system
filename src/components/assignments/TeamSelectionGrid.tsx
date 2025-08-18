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

// // src/pages/admin/AssignRequestPage/components/TeamSelectionGrid.tsx
// import { ReliefTeamDto } from "@/types/reliefTeam";
// import { TeamSelectionCard } from "./TeamSelectionCard";
// import { Input } from "@/components/ui/input";
// import { Search, Loader2 } from "lucide-react";
// import { useState, useEffect } from "react";
// import { getReliefTeams } from "@/api/reliefTeam";

// interface TeamSelectionGridProps {
//   selectedTeamId: number | null;
//   onTeamSelect: (teamId: number) => void;
// }

// export const TeamSelectionGrid = ({
//   selectedTeamId,
//   onTeamSelect,
// }: TeamSelectionGridProps) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [teams, setTeams] = useState<ReliefTeamDto[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getReliefTeams();
//         setTeams(data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to load relief teams. Please try again later.");
//         console.error("Error fetching relief teams:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTeams();
//   }, []);

//   const filteredTeams = teams.filter(team =>
//     team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     team.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     team.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <Loader2 className="h-6 w-6 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-destructive">
//         <p>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="relative">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search teams by name, specialization or location..."
//           className="pl-9"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
      
//       {filteredTeams.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//               onClick={() => setSearchTerm("")}
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
import { Search, Loader2, Frown } from "lucide-react";
import { useState, useEffect } from "react";
import { getReliefTeams } from "@/api/reliefTeam";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  const [activeTab, setActiveTab] = useState("all");
  const [visibleTeams, setVisibleTeams] = useState(6);

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

  const filteredTeams = teams
    .filter(team => {
      if (activeTab === "active") return team.status === "Active";
      if (activeTab === "specialized") return team.specialization;
      return true;
    })
    .filter(team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const loadMore = () => setVisibleTeams(prev => prev + 6);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading relief teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <Frown className="h-10 w-10 text-destructive mb-4" />
        <p className="text-destructive font-medium mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const visibleTeamList = filteredTeams.slice(0, visibleTeams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams by name, specialization or location..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted">
              <TabsTrigger value="all" className="px-3 py-1 text-xs">All Teams</TabsTrigger>
              <TabsTrigger value="active" className="px-3 py-1 text-xs">Active</TabsTrigger>
              <TabsTrigger value="specialized" className="px-3 py-1 text-xs">Specialized</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredTeams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleTeamList.map((team) => (
              <TeamSelectionCard
                key={team.id}
                team={team}
                selected={selectedTeamId === team.id}
                onSelect={() => onTeamSelect(team.id)}
              />
            ))}
          </div>
          
          {filteredTeams.length > visibleTeams && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMore}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Load More Teams ({filteredTeams.length - visibleTeams} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/30">
          <Frown className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-2">
            No relief teams found
          </p>
          <p className="text-sm text-muted-foreground mb-4 max-w-md text-center">
            {searchTerm
              ? `No teams match "${searchTerm}". Try different search terms.`
              : "No relief teams available with current filters"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-primary underline text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {Math.min(visibleTeams, filteredTeams.length)} of {filteredTeams.length} teams
        </div>
        {filteredTeams.length > 0 && (
          <Badge variant="outline">
            {activeTab === "active" 
              ? "Active Teams" 
              : activeTab === "specialized" 
                ? "Specialized Teams" 
                : "All Teams"}
          </Badge>
        )}
      </div>
    </div>
  );
};