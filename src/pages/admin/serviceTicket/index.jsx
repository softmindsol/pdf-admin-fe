import React, { useState, useEffect } from "react";
import {
  useGetServiceTicketsQuery,
  useDeleteServiceTicketMutation,
} from "@/store/GlobalApi";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// --- Shadcn UI Imports ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/pagination"; // Assuming this is a shared component
import { Badge } from "@/components/ui/badge"; // Added for status display
import { showDeleteConfirm } from "@/lib/swal";

export default function ServiceTicketManagement() {
  const navigate = useNavigate();
  const [deleteServiceTicket] = useDeleteServiceTicketMutation();

  // --- State Management for Filters ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1); // Reset to first page on new search
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- Fetch Service Tickets ---
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetServiceTicketsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const serviceTickets = response?.data?.serviceTickets || [];
  const pagination = response?.data?.pagination || {};
  const pageCount = pagination.totalPages || 0;

  // Function to render skeleton loaders
  const renderSkeletons = () => {
    return Array(limit)
      .fill(0)
      .map((_, index) => (
        <TableRow key={index}>
          <TableCell className="w-[40px]">
            <Skeleton className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
             <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Tickets</h1>
        <p className="text-muted-foreground">
          Manage all service tickets in the system.
        </p>
      </div>

      {/* --- Toolbar --- */}
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by job, customer, technician..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>
        <Button onClick={() => navigate("/service-ticket/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Service Ticket
        </Button>
      </div>

      {/* --- Data Table --- */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    Object.keys(rowSelection).length === serviceTickets.length &&
                    serviceTickets.length > 0
                  }
                  onCheckedChange={(checked) => {
                    const newSelection = {};
                    if (checked) {
                      serviceTickets.forEach(
                        (ticket) => (newSelection[ticket._id] = true)
                      );
                    }
                    setRowSelection(newSelection);
                  }}
                />
              </TableHead>
              <TableHead>Job Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completion Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              renderSkeletons()
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Failed to load data.
                </TableCell>
              </TableRow>
            ) : serviceTickets.length > 0 ? (
              serviceTickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>
                    <Checkbox
                      checked={rowSelection[ticket._id] || false}
                      onCheckedChange={(checked) => {
                        const newSelection = { ...rowSelection };
                        if (checked) {
                          newSelection[ticket._id] = true;
                        } else {
                          delete newSelection[ticket._id];
                        }
                        setRowSelection(newSelection);
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{ticket.jobName}</TableCell>
                  <TableCell>{ticket.customerName}</TableCell>
                  <TableCell>{ticket.technicianName}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.workOrderStatus === 'Complete' ? 'default' : 'secondary'}>
                      {ticket.workOrderStatus}
                    </Badge>
                  </TableCell>
                   <TableCell>
                    {format(new Date(ticket.completionDate), "PPP")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigate(`/service-ticket/${ticket._id}`)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/service-ticket/update/${ticket._id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>{
                            showDeleteConfirm(async ()=>{
                              await deleteServiceTicket(ticket._id).unwrap();
                            })
                          }
                          }
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      <DataTablePagination
        page={page}
        setPage={setPage}
        pageCount={pageCount}
        isLoading={isLoading || isFetching}
        selectedRowCount={Object.keys(rowSelection).length}
        totalItems={pagination.totalDocuments || 0} // Using totalDocuments as per ApiFeatures
        currentPage={pagination.currentPage || 0}
      />
    </div>
  );
}