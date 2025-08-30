// import React, { useEffect, useState } from 'react';
// import { useContactStore } from '@/store/contactStore';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { MoreHorizontal, Search, Mail, User, Calendar } from 'lucide-react';

// export const AdminContactManagement: React.FC = () => {
//   const { contacts, stats, isLoading, fetchAllContacts, fetchContactStats, deleteContact } = useContactStore();
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchAllContacts();
//     fetchContactStats();
//   }, [fetchAllContacts, fetchContactStats]);

//   const filteredContacts = contacts.filter(contact =>
//     contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     contact.message.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this contact?')) {
//       await deleteContact(id);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Contact Management</h1>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
//             <Mail className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.last30Days || 0}</div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.last7Days || 0}</div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Today</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.today || 0}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search and Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Contact Messages</CardTitle>
//           <CardDescription>
//             Manage all contact messages from users
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center py-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search contacts..."
//                 className="pl-8"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Phone</TableHead>
//                 <TableHead>Message</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredContacts.map((contact) => (
//                 <TableRow key={contact.id}>
//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-2">
//                       <User className="h-4 w-4" />
//                       {contact.name}
//                     </div>
//                   </TableCell>
//                   <TableCell>{contact.email}</TableCell>
//                   <TableCell>{contact.phone || 'N/A'}</TableCell>
//                   <TableCell className="max-w-xs truncate">
//                     {contact.message}
//                   </TableCell>
//                   <TableCell>
//                     {new Date(contact.submissionDate).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem
//                           onClick={() => navigator.clipboard.writeText(contact.email)}
//                         >
//                           Copy email
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => window.open(`mailto:${contact.email}`)}
//                         >
//                           Send email
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           className="text-red-600"
//                           onClick={() => handleDelete(contact.id)}
//                         >
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {filteredContacts.length === 0 && (
//             <div className="text-center py-8 text-muted-foreground">
//               No contact messages found
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { useContactStore } from '@/store/contactStore';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Mail, User, Calendar } from 'lucide-react';

export const AdminContactManagement: React.FC = () => {
  const { contacts, stats, isLoading, fetchAllContacts, fetchContactStats, deleteContact } = useContactStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- Pagination states ---
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5; // show 5 contacts per page

  useEffect(() => {
    fetchAllContacts();
    fetchContactStats();
  }, [fetchAllContacts, fetchContactStats]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Pagination logic ---
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(id);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.last30Days || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.last7Days || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.today || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>
            Manage all contact messages from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to page 1 on search
                }}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {contact.name}
                    </div>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {contact.message}
                  </TableCell>
                  <TableCell>
                    {new Date(contact.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(contact.email)}
                        >
                          Copy email
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          onClick={() => window.open(`mailto:${contact.email}`)}
                        >
                          Send email
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(contact.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contact messages found
            </div>
          )}

          {/* Pagination Controls */}
          {filteredContacts.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
