// // src/components/donation/DonationToastItem.tsx
// import { Banknote, Package, X } from 'lucide-react';
// import { DonationDto } from '../../api/donationService';

// interface DonationToastItemProps {
//   donation: DonationDto;
//   onDismiss: (id: number) => void;
// }

// export default function DonationToastItem({ donation, onDismiss }: DonationToastItemProps) {
//   return (
//     <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden ring-1 ring-gray-200">
//       <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-blue-500 to-green-500"></div>
      
//       <div className="pl-4 pr-6 py-4 ml-2">
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             {donation.type === 'Money' ? (
//               <Banknote className="h-6 w-6 text-red-500" />
//             ) : (
//               <Package className="h-6 w-6 text-green-500" />
//             )}
//           </div>
//           <div className="ml-3 flex-1">
//             <p className="text-sm font-medium text-white-900">
//               New {donation.type.toLowerCase()} donation received
//             </p>
//             <p className="mt-1 text-sm text-whit-600">
//               <span className="font-semibold">{donation.donorName || 'Anonymous'}</span> donated{' '}
//               {donation.type === 'Money'
//                 ? `${donation.currency} ${donation.amount?.toLocaleString()}`
//                 : `${donation.quantity} ${donation.unit}`}
//             </p>
//             <p className="mt-1 text-xs text-white-400">
//               {new Date(donation.dateReceived || new Date()).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit'
//               })}
//             </p>
//           </div>
//         </div>
//       </div>
      
//       <button
//         onClick={() => onDismiss(donation.id)}
//         className="absolute top-2 right-2 text-white-400 hover:text-white-500 focus:outline-none"
//       >
//         <X className="h-5 w-5" />
//       </button>
//     </div>
//   );
// }


// src/components/donation/DonationToastItem.tsx
import { Banknote, Package, X } from 'lucide-react';
import { DonationDto } from '../../api/donationService';

interface DonationToastItemProps {
  donation: DonationDto;
  onDismiss: (id: number) => void;
}

export default function DonationToastItem({ donation, onDismiss }: DonationToastItemProps) {
  return (
    <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden ring-1 ring-gray-200">
      <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-blue-500 to-green-500"></div>
      
      <div className="pl-4 pr-6 py-4 ml-2">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {donation.type === 'Money' ? (
              <Banknote className="h-6 w-6 text-red-500" />
            ) : (
              <Package className="h-6 w-6 text-green-500" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              New {(donation.type || 'donation').toLowerCase()} received
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">{donation.donorName || 'Anonymous'}</span> donated{' '}
              {/* {donation.type === 'Money'
                ? `${donation.currency} ${donation.amount?.toLocaleString()}`
                : `${donation.quantity} ${donation.unit}`} */}

              {donation.amount && donation.currency ? (
                <span className="font-semibold">
                  {donation.currency} {donation.amount.toLocaleString()}
                </span>
              ) : donation.quantity && donation.unit ? (
                <span className="font-semibold">
                  {donation.quantity} {donation.unit}
                </span>
              ) : (
                <span className="font-semibold">N/A</span>
              )}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(donation.dateReceived || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onDismiss(donation.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}