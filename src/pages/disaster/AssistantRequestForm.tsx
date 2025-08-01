import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssistanceRequestsStore } from '@/store/assistanceRequestStore';
import { RequestForm, formSchema } from '@/components/assistance_requests/RequestForm';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { HeartHandshake, Pencil } from 'lucide-react';

export const RequestFormPage = ({ editMode = false }: { editMode?: boolean }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    currentRequest,
    loading,
    error,
    fetchRequestById,
    createRequest,
    updateRequest,
    resetCurrentRequest,
  } = useAssistanceRequestsStore();

  // Get disasterEventId from query params if it exists
  const queryParams = new URLSearchParams(location.search);
  const disasterEventId = queryParams.get("eventId") ? Number(queryParams.get("eventId")) : undefined;

  useEffect(() => {
    const loadRequest = async () => {
      if (editMode && id) {
        try {
          await fetchRequestById(Number(id));
        } catch (err) {
          toast.error('Failed to load request data');
          navigate('/requests/assistant');
        }
      } else {
        resetCurrentRequest();
      }
    };

    loadRequest();
    return () => {
      resetCurrentRequest();
    };
  }, [editMode, id, fetchRequestById, resetCurrentRequest, navigate]);

 // Update the handleSubmit function in RequestFormPage.tsx
// In your RequestFormPage component
const handleSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const payload = {
      ...values,
      disasterEventId: disasterEventId || values.disasterEventId,
      // Convert empty strings to null for optional fields
      email: values.email || null,
      description: values.description || null,
      unit: values.unit || null,
      quantity: values.quantity || null
    };

    if (editMode && id) {
      await updateRequest(Number(id), payload);
      toast.success('Request updated successfully');
    } else {
      await createRequest(payload);
      toast.success('Request created successfully');
    }
    navigate('/requests/assistant');
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to submit request');
  }
};

  const initialFormValues: Partial<z.infer<typeof formSchema>> = {
    disasterEventId: currentRequest?.disasterEventId || disasterEventId,
    supportType: currentRequest?.supportType || '',
    quantity: currentRequest?.quantity || undefined,
    unit: currentRequest?.unit || '',
    description: currentRequest?.description || '',
    priority: currentRequest?.priority || 'Medium',
    contactName: currentRequest?.contactName || '',
    email: currentRequest?.email || '',
    contactPhone: currentRequest?.contactPhone || '',
    detailedAddress: currentRequest?.detailedAddress || '',
  };

  return (
    <div className="space-y-4">
      {/* <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
        Back
      </Button> */}

      <Card>
        {/* <CardHeader>
          <CardTitle>
            {editMode ? 'Edit Assistance Request' : 'Create New Assistance Request'}
          </CardTitle>
        </CardHeader> */}

      <CardHeader className="bg-white">
  <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
    {editMode ? (
      <>
        <Pencil className="h-6 w-6 text-blue-600 mr-3" />
        <span className="text-center w-full">Edit Assistance Request</span>
      </>
    ) : (
      <>
        <HeartHandshake className="h-6 w-6 text-blue-600 mr-3" />
        <span className="text-center w-full">Create New Assistance Request</span>
      </>
    )}
  </CardTitle>


</CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
          {editMode && !currentRequest && loading ? (
            <div>Loading request data...</div>
          ) : (
            <RequestForm 
              initialData={initialFormValues} 
              onSubmit={handleSubmit} 
              loading={loading} 
              isEdit={editMode}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};