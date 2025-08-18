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


// // src/pages/admin/AssignRequestPage/components/TeamSelectionCard.tsx
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
import { MapPin, Users, ShieldCheck, Calendar, Mail, Phone, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamSelectionCardProps {
  team: ReliefTeamDto;
  selected: boolean;
  onSelect: () => void;
}

export const TeamSelectionCard = ({ team, selected, onSelect }: TeamSelectionCardProps) => {
  return (
    <div
      className={cn(
        "border rounded-xl p-5 cursor-pointer transition-all bg-card shadow-sm hover:shadow-md",
        selected
          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
          : "border-border hover:border-primary/30"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full border mt-0.5",
            selected 
              ? "bg-primary border-primary text-white" 
              : "bg-muted border-border"
          )}>
            {selected && <Check className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="font-semibold text-base">{team.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={team.status === "Active" ? "default" : "secondary"} 
                className="text-xs"
              >
                {team.status}
              </Badge>
              {team.specialization && (
                <Badge variant="outline" className="text-xs">
                  {team.specialization}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-lg">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="text-sm">{team.numberOfMembers || 0} members</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-lg">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm">{team.locationName || team.address || "Not specified"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Established</p>
            <p className="text-sm">
              {new Date(team.establishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        {(team.email || team.phone) && (
          <div className="flex items-center gap-3">
            <div className="bg-muted p-2 rounded-lg">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              <div className="flex gap-2">
                {team.email && (
                  <a 
                    href={`mailto:${team.email}`} 
                    className="text-sm text-primary hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    {team.email}
                  </a>
                )}
                {team.phone && (
                  <a 
                    href={`tel:${team.phone}`} 
                    className="text-sm text-primary hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    {team.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};