// import { useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useAssistanceRequestsStore } from '@/store/assistanceRequestStore';
// import { RequestForm, formSchema } from '@/components/assistance_requests/RequestForm';
// // Replace react-hot-toast with sonner
// import { toast } from 'sonner';  // Change this import
// import { z } from 'zod';
// import { HeartHandshake, Pencil } from 'lucide-react';

// export const RequestFormPage = ({ editMode = false }: { editMode?: boolean }) => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     currentRequest,
//     loading,
//     error,
//     fetchRequestById,
//     createRequest,
//     updateRequest,
//     resetCurrentRequest,
//   } = useAssistanceRequestsStore();

//   // Get disasterEventId from query params if it exists
//   const queryParams = new URLSearchParams(location.search);
//   const disasterEventId = queryParams.get("eventId") ? Number(queryParams.get("eventId")) : undefined;

//   useEffect(() => {
//     const loadRequest = async () => {
//       if (editMode && id) {
//         try {
//           await fetchRequestById(Number(id));
//         } catch (err) {
//           toast.error('Failed to load request data');
//           navigate('/requests/assistant');
//         }
//       } else {
//         resetCurrentRequest();
//       }
//     };

//     loadRequest();
//     return () => {
//       resetCurrentRequest();
//     };
//   }, [editMode, id, fetchRequestById, resetCurrentRequest, navigate]);

//  // Update the handleSubmit function in RequestFormPage.tsx
// // In your RequestFormPage component
// const handleSubmit = async (values: z.infer<typeof formSchema>) => {
//   try {
//     const payload = {
//       ...values,
//       disasterEventId: disasterEventId || values.disasterEventId,
//       // Convert empty strings to null for optional fields
//       email: values.email || null,
//       description: values.description || null,
//       unit: values.unit || null,
//       quantity: values.quantity || null
//     };

//     if (editMode && id) {
//       await updateRequest(Number(id), payload);
//       toast.success('Request updated successfully');
//     } else {
//       await createRequest(payload);
//       toast.success('Request created successfully');
//     }
//     navigate('/profile');
//   } catch (error) {
//     toast.error(error instanceof Error ? error.message : 'Failed to submit request');
//   }
// };

//   const initialFormValues: Partial<z.infer<typeof formSchema>> = {
//     disasterEventId: currentRequest?.disasterEventId || disasterEventId,
//     supportType: currentRequest?.supportType || '',
//     quantity: currentRequest?.quantity || undefined,
//     unit: currentRequest?.unit || '',
//     description: currentRequest?.description || '',
//     priority: currentRequest?.priority || 'Medium',
//     contactName: currentRequest?.contactName || '',
//     email: currentRequest?.email || '',
//     contactPhone: currentRequest?.contactPhone || '',
//     detailedAddress: currentRequest?.detailedAddress || '',
//   };

//   return (
//     <div className="space-y-4">
//       {/* <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
//         Back
//       </Button> */}

//       <Card>
//         {/* <CardHeader>
//           <CardTitle>
//             {editMode ? 'Edit Assistance Request' : 'Create New Assistance Request'}
//           </CardTitle>
//         </CardHeader> */}

//       <CardHeader className="bg-white">
//   <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
//     {editMode ? (
//       <>
//         <Pencil className="h-6 w-6 text-blue-600 mr-3" />
//         <span className="text-center w-full">Edit Assistance Request</span>
//       </>
//     ) : (
//       <>
//         <HeartHandshake className="h-6 w-6 text-blue-600 mr-3" />
//         <span className="text-center w-full">Create New Assistance Request</span>
//       </>
//     )}
//   </CardTitle>


// </CardHeader>
//         <CardContent>
//           {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
//           {editMode && !currentRequest && loading ? (
//             <div>Loading request data...</div>
//           ) : (
//             <RequestForm 
//               initialData={initialFormValues} 
//               onSubmit={handleSubmit} 
//               loading={loading} 
//               isEdit={editMode}
//             />
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

"use client"

import { useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useAssistanceRequestsStore } from "@/store/assistanceRequestStore"
import { RequestForm, type formSchema } from "@/components/assistance_requests/RequestForm"
import { toast } from "sonner"
import type { z } from "zod"
import { Shield } from "lucide-react"

export const RequestFormPage = ({ editMode = false }: { editMode?: boolean }) => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { currentRequest, loading, error, fetchRequestById, createRequest, updateRequest, resetCurrentRequest } =
    useAssistanceRequestsStore()

  // Get disasterEventId from query params if it exists
  const queryParams = new URLSearchParams(location.search)
  const disasterEventId = queryParams.get("eventId") ? Number(queryParams.get("eventId")) : undefined

  useEffect(() => {
    const loadRequest = async () => {
      if (editMode && id) {
        try {
          await fetchRequestById(Number(id))
        } catch (err) {
          toast.error("Failed to load request data")
          navigate("/requests/assistant")
        }
      } else {
        resetCurrentRequest()
      }
    }

    loadRequest()
    return () => {
      resetCurrentRequest()
    }
  }, [editMode, id, fetchRequestById, resetCurrentRequest, navigate])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        disasterEventId: disasterEventId || values.disasterEventId,
        // Convert empty strings to null for optional fields
        email: values.email || null,
        description: values.description || null,
        unit: values.unit || null,
        quantity: values.quantity || null,
      }

      if (editMode && id) {
        await updateRequest(Number(id), payload)
        toast.success("Request updated successfully")
      } else {
        await createRequest(payload)
        toast.success("Request created successfully")
      }
      navigate("/profile")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit request")
    }
  }

  const initialFormValues: Partial<z.infer<typeof formSchema>> = {
    disasterEventId: currentRequest?.disasterEventId || disasterEventId,
    supportType: currentRequest?.supportType || "",
    quantity: currentRequest?.quantity || undefined,
    unit: currentRequest?.unit || "",
    description: currentRequest?.description || "",
    priority: currentRequest?.priority || "Medium",
    contactName: currentRequest?.contactName || "",
    email: currentRequest?.email || "",
    contactPhone: currentRequest?.contactPhone || "",
    detailedAddress: currentRequest?.detailedAddress || "",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {editMode && !currentRequest && loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading request data...</p>
            </div>
          </div>
        ) : (
          <RequestForm initialData={initialFormValues} onSubmit={handleSubmit} loading={loading} isEdit={editMode} />
        )}
      </div>
    </div>
  )
}
