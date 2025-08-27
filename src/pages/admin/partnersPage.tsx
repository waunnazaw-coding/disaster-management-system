// import React, { useEffect, useState } from 'react';
// import { usePartnerStore } from '../../store/partnerStore';
// import { Partner } from '../../types/partner';

// import { Plus, Search, Filter } from 'lucide-react';
// import { PartnersTable } from '@/components/partner/PartnersTable';
// import { PartnerForm } from '@/components/partner/PartnerForm';

// export const PartnersPage: React.FC = () => {
//   const { partners, loading, error, fetchPartners, clearError } = usePartnerStore();
//   const [showForm, setShowForm] = useState(false);
//   const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     fetchPartners();
//   }, [fetchPartners]);

//   const filteredPartners = partners.filter(partner => {
//     const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          partner.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          partner.email?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const handleEdit = (partner: Partner) => {
//     setEditingPartner(partner);
//     setShowForm(true);
//   };

//   const handleSuccess = () => {
//     setShowForm(false);
//     setEditingPartner(null);
//     fetchPartners();
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingPartner(null);
//   };

//   if (loading && partners.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Partners Management</h1>
//           <p className="text-gray-600">Manage your organization's partners and collaborators</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
//             {error}
//             <button
//               onClick={clearError}
//               className="float-right text-red-800 hover:text-red-900"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search partners..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex space-x-4">
//               <div className="relative">
//                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               <button
//                 onClick={() => setShowForm(true)}
//                 className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 <Plus size={20} />
//                 <span>Add Partner</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <PartnersTable
//             partners={filteredPartners}
//             onEdit={handleEdit}
//           />
//         </div>

//         {showForm && (
//           <PartnerForm
//             partner={editingPartner}
//             onSuccess={handleSuccess}
//             onCancel={handleCancel}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { usePartnerStore } from "../../store/partnerStore";
import { Partner } from "../../types/partner";
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { PartnersTable } from "@/components/partner/PartnersTable";
import { PartnerForm } from "@/components/partner/PartnerForm";
import { PartnerDetail } from "@/components/partner/PartnerDetail";

export const PartnersPage: React.FC = () => {
  const { partners, loading, error, fetchPartners, clearError } =
    usePartnerStore();
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Filter partners based on search term and status filter
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || partner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPartners = filteredPartners.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleView = (partner: Partner) => {
    setViewingPartner(partner);
    setShowDetail(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingPartner(null);
    fetchPartners();
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowDetail(false);
    setEditingPartner(null);
    setViewingPartner(null);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (loading && partners.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Partners Management
          </h1>
          <p className="text-gray-600">
            Manage your organization's partners and collaborators
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={clearError}
              className="float-right text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page when filtering
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                <span>Add Partner</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <PartnersTable
            partners={currentPartners}
            onEdit={handleEdit}
            onView={handleView}
          />
        </div>

        {/* Pagination Controls */}
        {filteredPartners.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">partners per page</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredPartners.length)} of{" "}
                {filteredPartners.length} partners
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <PartnerForm
            partner={editingPartner}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {showDetail && viewingPartner && (
          <PartnerDetail
            partner={viewingPartner}
            onClose={handleCancel}
            onEdit={(partner) => {
              setEditingPartner(partner);
              setShowDetail(false);
              setShowForm(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
