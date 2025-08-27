// // import { ApiResponse, Partner } from '@/types/partner';
// // import api from './axioInstance';

// // export const partnerService = {
// //   // Get all partners
// //   getAll: async (): Promise<Partner[]> => {
// //     const response = await api.get<ApiResponse<Partner[]>>('/partners');
// //     return response.data.data;
// //   },

// //   // Get partner by ID
// //   getById: async (id: number): Promise<Partner> => {
// //     const response = await api.get<ApiResponse<Partner>>(`/partners/${id}`);
// //     return response.data.data;
// //   },

// //   // Create new partner
// //   create: async (formData: FormData): Promise<Partner> => {
// //     const response = await api.post<ApiResponse<Partner>>('/partners', formData, {
// //       headers: { 'Content-Type': 'multipart/form-data' },
// //     });
// //     return response.data.data;
// //   },

// //   // Update partner
// //   update: async (id: number, formData: FormData): Promise<Partner> => {
// //     const response = await api.put<ApiResponse<Partner>>(`/partners/${id}`, formData, {
// //       headers: { 'Content-Type': 'multipart/form-data' },
// //     });
// //     return response.data.data;
// //   },

// //   // Delete partner
// //   delete: async (id: number): Promise<void> => {
// //     await api.delete(`/partners/${id}`);
// //   },

// //   // Update partner status
// //   updateStatus: async (id: number, status: string): Promise<void> => {
// //     await api.patch(`/partners/${id}/status`, { status });
// //   },
// // };



// // import { ApiResponse, Partner } from '@/types/partner';
// // import api from './axioInstance';

// // export const partnerService = {
// //   // Get all partners
// //   getAll: async (): Promise<Partner[]> => {
// //     const response = await api.get<ApiResponse<Partner[]>>('/partners');
// //     return response.data.data;
// //   },

// //   // Get partner by ID
// //   getById: async (id: number): Promise<Partner> => {
// //     const response = await api.get<ApiResponse<Partner>>(`/partners/${id}`);
// //     return response.data.data;
// //   },

// //   // Create new partner
// //   create: async (formData: FormData): Promise<Partner> => {
// //     const response = await api.post<ApiResponse<Partner>>('/partners', formData, {
// //       headers: { 
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     return response.data.data;
// //   },

// //   // Update partner - FIXED: Use proper PUT request
// //   update: async (id: number, formData: FormData): Promise<Partner> => {
// //     const response = await api.put<ApiResponse<Partner>>(`/partners/${id}`, formData, {
// //       headers: { 
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     return response.data.data;
// //   },

// //   // Delete partner
// //   delete: async (id: number): Promise<void> => {
// //     await api.delete(`/partners/${id}`);
// //   },

// //   // Update partner status - FIXED: Send as JSON object
// //   updateStatus: async (id: number, status: string): Promise<void> => {
// //     await api.patch(`/partners/${id}/status`, { status });
// //   },
// // };
// import { ApiResponse, Partner } from '@/types/partner';
// import api from './axioInstance';

// export const partnerService = {
//   // Get all partners
//   getAll: async (): Promise<Partner[]> => {
//     const response = await api.get<ApiResponse<Partner[]>>('/partners');
//     return response.data.data;
//   },

//   // Get partner by ID
//   getById: async (id: number): Promise<Partner> => {
//     const response = await api.get<ApiResponse<Partner>>(`/partners/${id}`);
//     return response.data.data;
//   },

//   // Create new partner
//   create: async (formData: FormData): Promise<Partner> => {
//     const response = await api.post<ApiResponse<Partner>>('/partners', formData, {
//       headers: { 
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data.data;
//   },

//   // Update partner - FIXED: Use PUT request directly
//   update: async (id: number, formData: FormData): Promise<Partner> => {
//     // Append the ID to the form data
//     formData.append('id', id.toString());
//     const response = await api.put<ApiResponse<Partner>>('/partners', formData, {
//       headers: { 
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data.data;
//   },

//   // Delete partner
//   delete: async (id: number): Promise<void> => {
//     await api.delete(`/partners/${id}`);
//   },

//   // Update partner status - FIXED: Send as JSON object
//   updateStatus: async (id: number, status: string): Promise<void> => {
//     await api.patch(`/partners/${id}/status`, { status });
//   },
// };


import { ApiResponse, Partner } from '@/types/partner';
import api from './axioInstance';

export const partnerService = {
  // Get all partners
  getAll: async (): Promise<Partner[]> => {
    const response = await api.get<ApiResponse<Partner[]>>('/partners');
    return response.data.data;
  },

  // Get partner by ID
  getById: async (id: number): Promise<Partner> => {
    const response = await api.get<ApiResponse<Partner>>(`/partners/${id}`);
    return response.data.data;
  },

  // Create new partner
  create: async (formData: FormData): Promise<Partner> => {
    const response = await api.post<ApiResponse<Partner>>('/partners', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update partner
  update: async (id: number, formData: FormData): Promise<Partner> => {
    // Create a new FormData and append all fields
    const updateData = new FormData();
    
    // Append all form fields
    formData.forEach((value, key) => {
      updateData.append(key, value);
    });
    
    // Explicitly append the ID
    updateData.append('id', id.toString());
    
    const response = await api.put<ApiResponse<Partner>>('/partners', updateData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete partner
  delete: async (id: number): Promise<void> => {
    await api.delete(`/partners/${id}`);
  },

  // Update partner status
// Update partner status
updateStatus: async (id: number, status: string): Promise<void> => {
  await api.patch(`/partners/${id}/status`, { status }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
},

// Get public partners
getPublic: async (): Promise<Partner[]> => {
  const response = await api.get<ApiResponse<Partner[]>>('/partners/public');
  return response.data.data;
},
};


