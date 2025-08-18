import { UserFilters } from "@/components/admin-layout/admin/UserFilters";
import { UserStatsCards } from "@/components/admin-layout/admin/UserStatsCards";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/ui/user-colums";
import useUserStore from "@/store/userStore";
import { useEffect } from "react";

export default function UserManagementPage() {
  const { 
    users, 
    loading, 
    error, 
    pagination, 
    stats,
    statsLoading,
    fetchUsers, 
    fetchStats,
    setPage 
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
         <UserStatsCards stats={stats} loading={statsLoading} />
        
        <UserFilters />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <DataTable columns={columns} data={users} isLoading={loading} />
        
        <div className="flex items-center justify-between">
           <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPage(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}