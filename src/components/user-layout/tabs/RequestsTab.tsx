// UserRequestsPage.tsx
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssistanceRequestsStore } from '@/store/assistanceRequestStore';
import { UserRequestsTable } from '@/components/assistance_requests/UserRequestTable';

// ✅ Correct import for react-hot-toast
import {toast} from 'sonner';
import { AssistanceRequest } from '@/types/assistanceRequests';

export default function UserRequestsPage() {
  const navigate = useNavigate();
  const {
    requests,
    loading,
    error,
    fetchUserRequests,
    deleteRequest,
  } = useAssistanceRequestsStore();

   const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(0);
  const [currentRequests, setCurrentRequests] = useState<AssistanceRequest[]>([]);

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);


  const handleRefresh = () => {
    fetchUserRequests();
  };


  // Calculate pagination when requests change
  useEffect(() => {
    if (requests.length > 0) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setCurrentRequests(requests.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(requests.length / pageSize));
    } else {
      setCurrentRequests([]);
      setTotalPages(0);
    }
  }, [requests, currentPage, pageSize]);
  const handleEdit = (id: number) => {
    navigate(`/requests/assistant/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRequest(id);
      toast.success('Request deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete request'
      );
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle view details
  const handleView = (id: number) => {
    navigate(`/requests/assistant/${id}`);
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Assistance Requests</h1>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button> */}
          <Button onClick={() => navigate('/disasters')}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
        </CardHeader>
        <CardContent>
           <UserRequestsTable
          requests={currentRequests}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView} // New prop
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        </CardContent>
      </Card>
    </div>
  );
}
