import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useAssistanceRequestsStore } from "@/store/assistanceRequestStore";
import { AdminRequestsTable } from "@/components/assistance_requests/AdminRequestsTable";
import RequestStats from "@/components/assistance_requests/RequestStats";

export default function AdminRequestsPage() {
  const {
    requests,
    loading,
    error,
    fetchAllRequests,
     fetchRequestStats,
    updateStatus,
    deleteRequest,
    stats
  } = useAssistanceRequestsStore();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchAllRequests(), fetchRequestStats()])
    }
    loadData()
  }, [fetchAllRequests, fetchRequestStats])
  // const handleRefresh = () => {
  //   fetchAllRequests();
  // };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assistance Requests</h1>
        {/* <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => navigate('/requests/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div> */}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      
      {/* Stats Cards */}
      <RequestStats
        totalCount={stats.totalCount}
        pendingCount={stats.pendingCount}
        approvedCount={stats.approvedCount}
        //inProgressCount={stats.inProgressCount}
        fulfilledCount={stats.fulfilledCount}
        rejectedCount={stats.rejectedCount}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminRequestsTable
            requests={requests}
            loading={loading}
            onStatusChange={updateStatus}
            onDelete={deleteRequest}
          />
        </CardContent>
      </Card>
    </div>
  );
}
