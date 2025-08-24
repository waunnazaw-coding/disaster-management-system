// import React from 'react';
// import { ReliefTeamActivityDTO } from '@/types/activity';
// import { format } from 'date-fns';
// import { Button } from '@/components/ui/button';
// import { Pencil, X } from 'lucide-react';

// interface ActivityDetailsProps {
//   activity: ReliefTeamActivityDTO;
//   onClose: () => void;
//   onEdit: () => void;
// }

// export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ 
//   activity, 
//   onClose,
//   onEdit
// }) => {
//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h2 className="text-2xl font-bold">{activity.title}</h2>
//               <div className="flex items-center mt-2">
//                 <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
//                   {activity.activityType}
//                 </span>
//                 <span className="ml-3 text-gray-500">
//                   {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
//                 </span>
//               </div>
//             </div>
//             <Button 
//               variant="ghost" 
//               size="icon"
//               onClick={onClose}
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Details</h3>
//               <div className="space-y-2">
//                 {activity.reliefTeamName && (
//                   <p>
//                     <span className="font-medium">Team:</span> {activity.reliefTeamName}
//                   </p>
//                 )}
//                 {activity.detailedAddress && (
//                   <p>
//                     <span className="font-medium">Location:</span> {activity.detailedAddress}
//                   </p>
//                 )}
//                 {activity.peopleHelped && (
//                   <p>
//                     <span className="font-medium">People Helped:</span> {activity.peopleHelped}
//                   </p>
//                 )}
//                 {activity.expenseAmount && (
//                   <p>
//                     <span className="font-medium">Expense:</span> ${activity.expenseAmount.toFixed(2)}
//                   </p>
//                 )}
//                 <p>
//                   <span className="font-medium">Created:</span> {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
//                 </p>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-2">Items Distributed</h3>
//               {activity.itemsDistributed ? (
//                 <p>{activity.itemsDistributed}</p>
//               ) : (
//                 <p className="text-gray-500">No items recorded</p>
//               )}
//             </div>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Description</h3>
//             <p className="whitespace-pre-wrap">{activity.description}</p>
//           </div>

//           {activity.media.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Media</h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {activity.media.map(media => (
//                   <div key={media.id} className="rounded-lg overflow-hidden">
//                     {media.isVideo ? (
//                       <video 
//                         src={media.filePath} 
//                         controls
//                         className="w-full h-40 object-cover"
//                       />
//                     ) : (
//                       <img 
//                         src={media.filePath} 
//                         alt={`Activity media ${media.id}`}
//                         className="w-full h-40 object-cover"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <Button 
//               variant="outline" 
//               onClick={onClose}
//             >
//               Close
//             </Button>
//             <Button 
//               onClick={onEdit}
//             >
//               <Pencil className="h-4 w-4 mr-2" /> Edit Activity
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useMemo, useState } from 'react';
import { ReliefTeamActivityDTO } from '@/types/activity';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  X,
  Calendar,
  Users,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Play,
  ZoomIn,
  User
} from 'lucide-react';

interface ActivityDetailsProps {
  activity: ReliefTeamActivityDTO;
  onClose: () => void;
  onEdit: () => void;
}

/** Neutral/dark chip style for the header */
const chipOnDark =
  'bg-white/10 text-white ring-1 ring-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center';

function formatCurrency(amount: number | null | undefined, currency = 'USD') {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return null;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  onClose,
  onEdit
}) => {
  const [viewer, setViewer] = useState<{ src: string; isVideo: boolean } | null>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const createdAt = activity.createdAt
    ? format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')
    : '-';
  const activityDate = activity.activityDate
    ? format(new Date(activity.activityDate), 'MMM dd, yyyy')
    : '-';
  const expense =
    formatCurrency((activity as any).expenseAmount ?? undefined) ?? '-';
  const people =
    (activity as any).peopleHelped !== null && (activity as any).peopleHelped !== undefined
      ? String((activity as any).peopleHelped)
      : '-';

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-details-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-4xl h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Grid layout: header | scroll area | footer */}
          <div className="grid h-full grid-rows-[auto,1fr,auto] overflow-hidden">
            {/* Header (dark neutral) */}
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className={chipOnDark}>{activity.activityType}</span>
                  <h2
                    id="activity-details-title"
                    className="mt-3 text-2xl md:text-3xl font-bold tracking-tight truncate"
                    title={activity.title}
                  >
                    {activity.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm/6 text-white/90">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {activityDate}
                    </span>

                    {activity.reliefTeamName && (
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">{activity.reliefTeamName}</span>
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white/90 hover:text-white hover:bg-white/10"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scroll area (only this row scrolls) */}
            <div className="min-h-0 overflow-y-auto">
              <div className="p-6">
                {/* Details card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                    Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-sm text-slate-700">
                    {activity.detailedAddress && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-0.5 text-slate-500" />
                        <div>
                          <div className="text-slate-500">Location</div>
                          <div className="font-medium">{activity.detailedAddress}</div>
                        </div>
                      </div>
                    )}

                    {/* <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 mt-0.5 text-slate-500" />
                      <div>
                        <div className="text-slate-500">People Helped</div>
                        <div className="font-medium">{people}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="h-4 w-4 mt-0.5 text-slate-500" />
                      <div>
                        <div className="text-slate-500">Expense</div>
                        <div className="font-medium">{expense}</div>
                      </div>
                    </div> */}

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-0.5 text-slate-500" />
                      <div>
                        <div className="text-slate-500">Created</div>
                        <div className="font-medium">{createdAt}</div>
                      </div>
                    </div>

                     <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 mt-0.5 text-slate-500" />
                      <div>
                        <div className="text-slate-500">Relief Team</div>
                        <div className="font-medium">{activity.reliefTeamName}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 mt-0.5 text-slate-500" />
                      <div>
                        <div className="text-slate-500">Posted By</div>
                        <div className="font-medium">{activity.postedByUserName}</div>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-slate-200 p-5 mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                    Description
                  </h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                {/* Media (no overlap + full image in tile) */}
                {activity.media?.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                      Media
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {activity.media.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setViewer({ src: m.filePath, isVideo: !!m.isVideo })}
                          className="group relative block overflow-hidden rounded-xl ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100"
                          title="Open media"
                        >
                          {/* Fixed aspect ratio so rows are even; object-contain means full image visible */}
                          <div className="aspect-[4/3] w-full">
                            {m.isVideo ? (
                              <video className="h-full w-full object-contain" src={m.filePath} muted />
                            ) : (
                              <img className="h-full w-full object-contain" src={m.filePath} alt="" />
                            )}
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all group-hover:bg-slate-900/40 group-hover:opacity-100">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-slate-900">
                              {m.isVideo ? <Play className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                              View
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer (never overlays content) */}
            <div className="flex items-center justify-end gap-3 border-t bg-white p-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Activity
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox viewer */}
      {viewer && (
        <>
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setViewer(null)}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setViewer(null)}
                className="absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow hover:bg-white"
                aria-label="Close media viewer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center justify-center bg-black">
                {viewer.isVideo ? (
                  <video src={viewer.src} controls className="max-h-[85vh] w-full" autoPlay />
                ) : (
                  <img src={viewer.src} alt="" className="max-h-[85vh] w-auto" />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
