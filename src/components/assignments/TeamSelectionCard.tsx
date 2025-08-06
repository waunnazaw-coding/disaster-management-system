// // src/components/assignments/AssignRequestForm/TeamSelectionCard.tsx
// import { ReliefTeamDto } from "@/types/reliefTeam";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Users, ShieldCheck, Calendar, Mail, Phone } from "lucide-react";

// interface TeamSelectionCardProps {
//   team: ReliefTeamDto;
//   selected: boolean;
//   onSelect: () => void;
// }

// export const TeamSelectionCard = ({ team, selected, onSelect }: TeamSelectionCardProps) => {
//   return (
//     <div
//       className={`border rounded-lg p-4 cursor-pointer transition-all ${
//         selected
//           ? "border-primary ring-2 ring-primary/20 bg-primary/5"
//           : "hover:border-primary/50 hover:bg-gray-50"
//       }`}
//       onClick={onSelect}
//     >
//       <div className="flex justify-between items-start">
//         <h3 className="font-medium text-lg">{team.name}</h3>
//         <Badge variant={team.status === "Active" ? "default" : "secondary"}>
//           {team.status}
//         </Badge>
//       </div>
      
//       <div className="mt-3 space-y-2">
//         <div className="flex items-center gap-2 text-sm">
//           <Users className="h-4 w-4 text-muted-foreground" />
//           <span>{team.numberOfMembers || 0} members</span>
//         </div>
        
//         <div className="flex items-center gap-2 text-sm">
//           <MapPin className="h-4 w-4 text-muted-foreground" />
//           <span>{team.locationName || team.address || "Location not specified"}</span>
//         </div>
        
//         {team.specialization && (
//           <div className="flex items-center gap-2 text-sm">
//             <ShieldCheck className="h-4 w-4 text-muted-foreground" />
//             <span>Specializes in {team.specialization}</span>
//           </div>
//         )}
        
//         <div className="flex items-center gap-2 text-sm">
//           <Calendar className="h-4 w-4 text-muted-foreground" />
//           <span>Established: {new Date(team.establishedDate).toLocaleDateString()}</span>
//         </div>
        
//         {team.email && (
//           <div className="flex items-center gap-2 text-sm">
//             <Mail className="h-4 w-4 text-muted-foreground" />
//             <span>{team.email}</span>
//           </div>
//         )}
        
//         {team.phone && (
//           <div className="flex items-center gap-2 text-sm">
//             <Phone className="h-4 w-4 text-muted-foreground" />
//             <span>{team.phone}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// src/pages/admin/AssignRequestPage/components/TeamSelectionCard.tsx
import { ReliefTeamDto } from "@/types/reliefTeam";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, ShieldCheck, Calendar, Mail, Phone } from "lucide-react";

interface TeamSelectionCardProps {
  team: ReliefTeamDto;
  selected: boolean;
  onSelect: () => void;
}

export const TeamSelectionCard = ({ team, selected, onSelect }: TeamSelectionCardProps) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selected
          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
          : "hover:border-primary/50 hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg">{team.name}</h3>
        <Badge variant={team.status === "Active" ? "default" : "secondary"}>
          {team.status}
        </Badge>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{team.numberOfMembers || 0} members</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{team.locationName || team.address || "Location not specified"}</span>
        </div>
        
        {team.specialization && (
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <span>Specializes in {team.specialization}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Established: {new Date(team.establishedDate).toLocaleDateString()}</span>
        </div>
        
        {team.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{team.email}</span>
          </div>
        )}
        
        {team.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{team.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};