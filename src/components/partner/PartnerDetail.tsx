import React from 'react';
import { Partner } from '../../types/partner';
import { X, Mail, Phone, MapPin, Globe, Calendar, User, Eye, EyeOff } from 'lucide-react';

interface PartnerDetailProps {
  partner: Partner;
  onClose: () => void;
  onEdit: (partner: Partner) => void;
}

export const PartnerDetail: React.FC<PartnerDetailProps> = ({ partner, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Partner Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            {partner.logoUrl ? (
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="w-20 h-20 object-contain rounded"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No logo</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{partner.name}</h1>
              {partner.contactName && (
                <div className="flex items-center mt-1 text-gray-600">
                  <User size={16} className="mr-1" />
                  {partner.contactName}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="text-gray-400 mr-2" size={20} />
              <span>{partner.email || 'No email provided'}</span>
            </div>
            
            <div className="flex items-center">
              <Phone className="text-gray-400 mr-2" size={20} />
              <span>{partner.phone || 'No phone provided'}</span>
            </div>
            
            {partner.address && (
              <div className="flex items-center md:col-span-2">
                <MapPin className="text-gray-400 mr-2" size={20} />
                <span>{partner.address}</span>
              </div>
            )}
            
            {partner.website && (
              <div className="flex items-center md:col-span-2">
                <Globe className="text-gray-400 mr-2" size={20} />
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {partner.website}
                </a>
              </div>
            )}
          </div>

          {partner.notes && (
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded">{partner.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Status</h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  partner.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {partner.status === 'Active' ? (
                  <Eye size={14} className="mr-1" />
                ) : (
                  <EyeOff size={14} className="mr-1" />
                )}
                {partner.status}
              </span>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Visibility</h3>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  partner.isPublic
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {partner.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Created</h3>
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-1" />
                {new Date(partner.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Last Updated</h3>
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-1" />
                {new Date(partner.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(partner)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Edit Partner
          </button>
        </div>
      </div>
    </div>
  );
};