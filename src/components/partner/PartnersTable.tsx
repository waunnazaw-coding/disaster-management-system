// // // import React, { useState } from 'react';
// // // import { Partner } from '../../types/partner';
// // // import { usePartnerStore } from '../../store/partnerStore';
// // // import { Edit3, Trash2, Eye, EyeOff, MoreVertical } from 'lucide-react';

// // // interface PartnersTableProps {
// // //   partners: Partner[];
// // //   onEdit: (partner: Partner) => void;
// // // }

// // // export const PartnersTable: React.FC<PartnersTableProps> = ({ partners, onEdit }) => {
// // //   const { deletePartner, updatePartnerStatus } = usePartnerStore();
// // //   const [actionMenu, setActionMenu] = useState<number | null>(null);

// // //   const handleDelete = async (id: number) => {
// // //     if (window.confirm('Are you sure you want to delete this partner?')) {
// // //       await deletePartner(id);
// // //       setActionMenu(null);
// // //     }
// // //   };

// // //   const toggleStatus = async (partner: Partner) => {
// // //     const newStatus = partner.status === 'Active' ? 'Inactive' : 'Active';
// // //     await updatePartnerStatus(partner.id, newStatus);
// // //     setActionMenu(null);
// // //   };

// // //   const formatDate = (dateString: string) => {
// // //     return new Date(dateString).toLocaleDateString();
// // //   };

// // //   return (
// // //     <div className="bg-white shadow-sm rounded-lg overflow-hidden">
// // //       <div className="overflow-x-auto">
// // //         <table className="min-w-full divide-y divide-gray-200">
// // //           <thead className="bg-gray-50">
// // //             <tr>
// // //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Logo
// // //               </th>
// // //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Name
// // //               </th>
// // //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Contact
// // //               </th>
// // //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Status
// // //               </th>
// // //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Visibility
// // //               </th>
// // //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Created
// // //               </th>
// // //               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                 Actions
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody className="bg-white divide-y divide-gray-200">
// // //             {partners.map((partner) => (
// // //               <tr key={partner.id} className="hover:bg-gray-50">
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   {partner.logoUrl ? (
// // //                     <img
// // //                       src={partner.logoUrl}
// // //                       alt={partner.name}
// // //                       className="h-10 w-10 object-contain rounded"
// // //                     />
// // //                   ) : (
// // //                     <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
// // //                       <span className="text-gray-400 text-xs">No logo</span>
// // //                     </div>
// // //                   )}
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <div className="text-sm font-medium text-gray-900">
// // //                     {partner.name}
// // //                   </div>
// // //                   {partner.website && (
// // //                     <div className="text-sm text-blue-600">
// // //                       <a
// // //                         href={partner.website}
// // //                         target="_blank"
// // //                         rel="noopener noreferrer"
// // //                         className="hover:underline"
// // //                       >
// // //                         {partner.website}
// // //                       </a>
// // //                     </div>
// // //                   )}
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <div className="text-sm text-gray-900">
// // //                     {partner.contactName}
// // //                   </div>
// // //                   <div className="text-sm text-gray-500">
// // //                     {partner.email}
// // //                   </div>
// // //                   {partner.phone && (
// // //                     <div className="text-sm text-gray-500">
// // //                       {partner.phone}
// // //                     </div>
// // //                   )}
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <span
// // //                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// // //                       partner.status === 'Active'
// // //                         ? 'bg-green-100 text-green-800'
// // //                         : 'bg-gray-100 text-gray-800'
// // //                     }`}
// // //                   >
// // //                     {partner.status}
// // //                   </span>
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap">
// // //                   <span
// // //                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// // //                       partner.isPublic
// // //                         ? 'bg-blue-100 text-blue-800'
// // //                         : 'bg-gray-100 text-gray-800'
// // //                     }`}
// // //                   >
// // //                     {partner.isPublic ? 'Public' : 'Private'}
// // //                   </span>
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // //                   {formatDate(partner.createdAt)}
// // //                 </td>
// // //                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
// // //                   <button
// // //                     onClick={() => setActionMenu(partner.id)}
// // //                     className="text-gray-400 hover:text-gray-600"
// // //                   >
// // //                     <MoreVertical size={20} />
// // //                   </button>
                  
// // //                   {actionMenu === partner.id && (
// // //                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
// // //                       <div className="py-1">
// // //                         <button
// // //                           onClick={() => onEdit(partner)}
// // //                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// // //                         >
// // //                           <Edit3 size={16} className="mr-2" />
// // //                           Edit
// // //                         </button>
// // //                         <button
// // //                           onClick={() => toggleStatus(partner)}
// // //                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// // //                         >
// // //                           {partner.status === 'Active' ? (
// // //                             <>
// // //                               <EyeOff size={16} className="mr-2" />
// // //                               Deactivate
// // //                             </>
// // //                           ) : (
// // //                             <>
// // //                               <Eye size={16} className="mr-2" />
// // //                               Activate
// // //                             </>
// // //                           )}
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleDelete(partner.id)}
// // //                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
// // //                         >
// // //                           <Trash2 size={16} className="mr-2" />
// // //                           Delete
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
        
// // //         {partners.length === 0 && (
// // //           <div className="text-center py-12 text-gray-500">
// // //             No partners found. Create your first partner to get started.
// // //           </div>
// // //         )}
// // //       </div>
      
// // //       {actionMenu && (
// // //         <div
// // //           className="fixed inset-0 z-10"
// // //           onClick={() => setActionMenu(null)}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // };


// // import React, { useState } from 'react';
// // import { Partner } from '../../types/partner';
// // import { usePartnerStore } from '../../store/partnerStore';
// // import { Edit3, Trash2, Eye, EyeOff, MoreVertical, ExternalLink } from 'lucide-react';

// // interface PartnersTableProps {
// //   partners: Partner[];
// //   onEdit: (partner: Partner) => void;
// //   onView: (partner: Partner) => void;
// // }


// // export const PartnersTable: React.FC<PartnersTableProps> = ({ partners, onEdit, onView }) => {
// //   const { deletePartner, updatePartnerStatus } = usePartnerStore();
// //   const [actionMenu, setActionMenu] = useState<number | null>(null);

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm('Are you sure you want to delete this partner?')) {
// //       await deletePartner(id);
// //       setActionMenu(null);
// //     }
// //   };

  

// //   const toggleStatus = async (partner: Partner) => {
// //     const newStatus = partner.status === 'Active' ? 'Inactive' : 'Active';
// //     await updatePartnerStatus(partner.id, newStatus);
// //     setActionMenu(null);
// //   };

// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString();
// //   };

// //   return (
// //     <div className="bg-white shadow-sm rounded-lg overflow-hidden">
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full divide-y divide-gray-200">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Logo
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Name
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Contact
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Status
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Visibility
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Created
// //               </th>
// //               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Actions
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {partners.map((partner) => (
// //               <tr key={partner.id} className="hover:bg-gray-50">
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   {partner.logoUrl ? (
// //                     <img
// //                       src={partner.logoUrl}
// //                       alt={partner.name}
// //                       className="h-10 w-10 object-contain rounded"
// //                     />
// //                   ) : (
// //                     <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
// //                       <span className="text-gray-400 text-xs">No logo</span>
// //                     </div>
// //                   )}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <div className="text-sm font-medium text-gray-900">
// //                     {partner.name}
// //                   </div>
// //                   {partner.website && (
// //                     <div className="text-sm text-blue-600">
// //                       <a
// //                         href={partner.website}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="hover:underline flex items-center"
// //                       >
// //                         {partner.website}
// //                         <ExternalLink size={12} className="ml-1" />
// //                       </a>
// //                     </div>
// //                   )}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <div className="text-sm text-gray-900">
// //                     {partner.contactName}
// //                   </div>
// //                   <div className="text-sm text-gray-500">
// //                     {partner.email}
// //                   </div>
// //                   {partner.phone && (
// //                     <div className="text-sm text-gray-500">
// //                       {partner.phone}
// //                     </div>
// //                   )}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span
// //                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// //                       partner.status === 'Active'
// //                         ? 'bg-green-100 text-green-800'
// //                         : 'bg-gray-100 text-gray-800'
// //                     }`}
// //                   >
// //                     {partner.status}
// //                   </span>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span
// //                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// //                       partner.isPublic
// //                         ? 'bg-blue-100 text-blue-800'
// //                         : 'bg-gray-100 text-gray-800'
// //                     }`}
// //                   >
// //                     {partner.isPublic ? 'Public' : 'Private'}
// //                   </span>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {formatDate(partner.createdAt)}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
// //                   <button
// //                     onClick={() => setActionMenu(partner.id)}
// //                     className="text-gray-400 hover:text-gray-600 p-1 rounded"
// //                   >
// //                     <MoreVertical size={20} />
// //                   </button>
                  
// //                   {actionMenu === partner.id && (
// //                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
// //                       <div className="py-1">
// //                         <button
// //                           onClick={() => onView(partner)}
// //                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                         >
// //                           <Eye size={16} className="mr-2" />
// //                           View Details
// //                         </button>
// //                         <button
// //                           onClick={() => onEdit(partner)}
// //                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                         >
// //                           <Edit3 size={16} className="mr-2" />
// //                           Edit
// //                         </button>
// //                         <button
// //                           onClick={() => toggleStatus(partner)}
// //                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //                         >
// //                           {partner.status === 'Active' ? (
// //                             <>
// //                               <EyeOff size={16} className="mr-2" />
// //                               Deactivate
// //                             </>
// //                           ) : (
// //                             <>
// //                               <Eye size={16} className="mr-2" />
// //                               Activate
// //                             </>
// //                           )}
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(partner.id)}
// //                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
// //                         >
// //                           <Trash2 size={16} className="mr-2" />
// //                           Delete
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
        
// //         {partners.length === 0 && (
// //           <div className="text-center py-12 text-gray-500">
// //             No partners found. Create your first partner to get started.
// //           </div>
// //         )}
// //       </div>
      
// //       {actionMenu && (
// //         <div
// //           className="fixed inset-0 z-10"
// //           onClick={() => setActionMenu(null)}
// //         />
// //       )}
// //     </div>
// //   );
// // };


// import React, { useState, useRef, useEffect } from 'react';
// import { Partner } from '../../types/partner';
// import { usePartnerStore } from '../../store/partnerStore';
// import { Edit3, Trash2, Eye, EyeOff, MoreVertical, ExternalLink } from 'lucide-react';

// interface PartnersTableProps {
//   partners: Partner[];
//   onEdit: (partner: Partner) => void;
//   onView: (partner: Partner) => void;
// }

// export const PartnersTable: React.FC<PartnersTableProps> = ({ partners, onEdit, onView }) => {
//   const { deletePartner, updatePartnerStatus } = usePartnerStore();
//   const [actionMenu, setActionMenu] = useState<number | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setActionMenu(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this partner?')) {
//       await deletePartner(id);
//       setActionMenu(null);
//     }
//   };

//   const toggleStatus = async (partner: Partner) => {
//     const newStatus = partner.status === 'Active' ? 'Inactive' : 'Active';
//     await updatePartnerStatus(partner.id, newStatus);
//     setActionMenu(null);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Logo
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Contact
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Visibility
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Created
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {partners.map((partner) => (
//               <tr key={partner.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {partner.logoUrl ? (
//                     <img
//                       src={partner.logoUrl}
//                       alt={partner.name}
//                       className="h-10 w-10 object-contain rounded"
//                     />
//                   ) : (
//                     <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
//                       <span className="text-gray-400 text-xs">No logo</span>
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {partner.name}
//                   </div>
//                   {partner.website && (
//                     <div className="text-sm text-blue-600">
//                       <a
//                         href={partner.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="hover:underline flex items-center"
//                       >
//                         {partner.website}
//                         <ExternalLink size={12} className="ml-1" />
//                       </a>
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     {partner.contactName}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {partner.email}
//                   </div>
//                   {partner.phone && (
//                     <div className="text-sm text-gray-500">
//                       {partner.phone}
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       partner.status === 'Active'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}
//                   >
//                     {partner.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       partner.isPublic
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}
//                   >
//                     {partner.isPublic ? 'Public' : 'Private'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {formatDate(partner.createdAt)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setActionMenu(actionMenu === partner.id ? null : partner.id);
//                     }}
//                     className="text-gray-400 hover:text-gray-600 p-1 rounded"
//                   >
//                     <MoreVertical size={20} />
//                   </button>
                  
//                   {actionMenu === partner.id && (
//                     <div 
//                       ref={menuRef}
//                       className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border"
//                       style={{ top: '100%' }}
//                     >
//                       <div className="py-1">
//                         <button
//                           onClick={() => onView(partner)}
//                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           <Eye size={16} className="mr-2" />
//                           View Details
//                         </button>
//                         <button
//                           onClick={() => onEdit(partner)}
//                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           <Edit3 size={16} className="mr-2" />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => toggleStatus(partner)}
//                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           {partner.status === 'Active' ? (
//                             <>
//                               <EyeOff size={16} className="mr-2" />
//                               Deactivate
//                             </>
//                           ) : (
//                             <>
//                               <Eye size={16} className="mr-2" />
//                               Activate
//                             </>
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleDelete(partner.id)}
//                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                         >
//                           <Trash2 size={16} className="mr-2" />
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {partners.length === 0 && (
//           <div className="text-center py-12 text-gray-500">
//             No partners found. Create your first partner to get started.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState, useRef, useEffect } from 'react';
import { Partner } from '../../types/partner';
import { usePartnerStore } from '../../store/partnerStore';
import { Edit3, Trash2, Eye, EyeOff, MoreVertical, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PartnersTableProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onView: (partner: Partner) => void;
}

export const PartnersTable: React.FC<PartnersTableProps> = ({ partners, onEdit, onView }) => {
  const { deletePartner, updatePartnerStatus } = usePartnerStore();
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [processingStatus, setProcessingStatus] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(id);
        setActionMenu(null);
        toast.success('Partner deleted successfully');
      } catch (error) {
        console.error('Failed to delete partner:', error);
        toast.error('Failed to delete partner');
      }
    }
  };

  const toggleStatus = async (partner: Partner) => {
    setProcessingStatus(partner.id);
    try {
      const newStatus = partner.status === 'Active' ? 'Inactive' : 'Active';
      await updatePartnerStatus(partner.id, newStatus);
      setActionMenu(null);
      toast.success(`Partner status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update partner status');
    } finally {
      setProcessingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-10 w-10 object-contain rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No logo</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {partner.name}
                  </div>
                  {partner.website && (
                    <div className="text-sm text-blue-600">
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center"
                      >
                        {partner.website}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {partner.contactName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {partner.email}
                  </div>
                  {partner.phone && (
                    <div className="text-sm text-gray-500">
                      {partner.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {processingStatus === partner.id ? (
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        partner.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {partner.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      partner.isPublic
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {partner.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(partner.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionMenu(actionMenu === partner.id ? null : partner.id);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                    disabled={processingStatus === partner.id}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {actionMenu === partner.id && (
                    <div 
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border"
                      style={{ top: '100%' }}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onView(partner);
                            setActionMenu(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onEdit(partner);
                            setActionMenu(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit3 size={16} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(partner)}
                          disabled={processingStatus === partner.id}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {partner.status === 'Active' ? (
                            <>
                              <EyeOff size={16} className="mr-2" />
                              {processingStatus === partner.id ? 'Deactivating...' : 'Deactivate'}
                            </>
                          ) : (
                            <>
                              <Eye size={16} className="mr-2" />
                              {processingStatus === partner.id ? 'Activating...' : 'Activate'}
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {partners.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No partners found. Create your first partner to get started.
          </div>
        )}
      </div>
    </div>
  );
};