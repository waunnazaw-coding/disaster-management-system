import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useUserStore from '@/store/userStore';
import { useEffect, useState,useCallback } from 'react';
import { debounce } from 'lodash';
import {User} from "@/types/user"

export function UserFilters() {
  const { filters, setFilters } = useUserStore();
  const [searchInput, setSearchInput] = useState(filters.search || '');
 // Create a memoized debounce function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters({ ...filters, search: value });
    }, 300),
    [filters]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };


   const handleRoleChange = (value: string) => {
    setFilters({ 
      ...filters, 
      role: value === 'all' ? undefined : value
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ 
      ...filters, 
      status: value === 'all' ? undefined : value
    });
  };

  const clearFilters = () => {
    setFilters({ search: undefined, role: undefined, status: undefined });
    setSearchInput('');
    debouncedSearch('');
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
   // Sync local state with store when filters change externally
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  const hasFilters = 
    searchInput || 
    (filters.role && filters.role !== 'all') || 
    (filters.status && filters.status !== 'all');


    return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          className="pl-9"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>
      
      <Select 
        value={filters.role || 'all'} 
        onValueChange={handleRoleChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="User">User</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="SysAdmin">System Admin</SelectItem>
          <SelectItem value="ReliefTeam">Relief Team</SelectItem>
        </SelectContent>
      </Select>
      
      {/* <Select 
        value={filters.status || 'all'} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Blacklisted">Blocked</SelectItem>
        </SelectContent>
      </Select> */}
      
      {hasFilters && (
        <Button variant="ghost" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}