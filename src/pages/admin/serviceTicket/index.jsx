import React, { useState, useEffect } from "react";
import {
  useGetServiceTicketsQuery,
  useDeleteServiceTicketMutation,
  useLazyGetSignedUrlQuery,
  useGetDepartmentsQuery,
} from "@/store/GlobalApi";
import { MoreHorizontal, PlusCircle, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { showDeleteConfirm } from "@/lib/swal";
import { getUserData } from "@/lib/auth";

export default function ServiceTicketManagement() {
  const navigate = useNavigate();
  const [deleteServiceTicket] = useDeleteServiceTicketMutation();
  const [triggerGetSignedUrl, { isLoading: isDownloading }] =
    useLazyGetSignedUrlQuery();

  // --- State Management for Filters ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // 1. ADDED: State for date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const user = getUserData();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: departmentResponse, isLoading: areDepartmentsLoading } =
    useGetDepartmentsQuery({ page: 0 });
  const departments = departmentResponse?.data?.departments || [];

  // 2. UPDATED: Pass date filters to the RTK Query hook
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetServiceTicketsQuery({
    page,
    limit,
    search: debouncedSearch,
    department: departmentFilter && departmentFilter !== "all" ? departmentFilter : undefined,
    startDate, // Pass startDate state
    endDate,   // Pass endDate state
  });

  const serviceTickets = response?.data?.serviceTickets || [];
  const pagination = response?.data?.pagination || {};
  const pageCount = pagination.totalPages || 0;

  const handleDownloadPdf = async (ticket) => {
    if (!ticket.ticket) {
      toast.error("No PDF found for this service ticket.");
      return;
    }
    try {
      const apiResponse = await triggerGetSignedUrl(ticket.ticket).unwrap();
      const signedUrl = apiResponse.data.url;
      window.open(signedUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening PDF...");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Could not open the PDF. Please try again.");
    }
  };

  const renderSkeletons = () => {
    return Array(limit)
      .fill(0)
      .map((_, index) => (
        <TableRow key={index}>
          <TableCell className="w-[40px]"><Skeleton className="h-4 w-4" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ));
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Tickets</h1>
        <p className="text-muted-foreground">Manage all service tickets in the system.</p>
      </div>

      {/* 3. UPDATED: Responsive Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Group */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[250px] max-w-xs sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by job, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>

          {/* Department Filter */}
          {user?.role === "admin" && (
            <Select
              value={departmentFilter}
              onValueChange={(value) => { setDepartmentFilter(value); setPage(1); }}
              disabled={areDepartmentsLoading}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select a department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (<SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>))}
              </SelectContent>
            </Select>
          )}

          {/* Date filter inputs */}
          <div className="flex items-center space-x-2">
            <label htmlFor="startDate" className="text-sm font-medium text-muted-foreground whitespace-nowrap">From</label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-[150px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="endDate" className="text-sm font-medium text-muted-foreground whitespace-nowrap">To</label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-[150px]"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <Button onClick={() => navigate("/service-ticket/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service Ticket
          </Button>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="rounded-md border pl-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completion Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              renderSkeletons()
            ) : isError ? (
              <TableRow><TableCell colSpan={8} className="h-24 text-center">Failed to load data.</TableCell></TableRow>
            ) : serviceTickets.length > 0 ? (
              serviceTickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell className="font-medium">{ticket.jobName}</TableCell>
                  <TableCell>{ticket.customerName}</TableCell>
                  <TableCell>{ticket.technicianName}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.workOrderStatus === "Complete" ? "default" : "secondary"}>
                      {ticket.workOrderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(ticket.completionDate), "PPP")}</TableCell>
                  <TableCell>{ticket.createdBy?.username || "N/A"}</TableCell>
                  <TableCell>{format(new Date(ticket.createdAt), "PPP") || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/service-ticket/${ticket._id}`)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/service-ticket/update/${ticket._id}`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem disabled={!ticket.ticket || isDownloading} onClick={() => handleDownloadPdf(ticket)}>
                          <Download className="mr-1 h-4 w-4" />
                          <span>Download PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => showDeleteConfirm(() => deleteServiceTicket(ticket._id).unwrap())} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={8} className="h-24 text-center">No results found.</TableCell></TableRow>
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
        totalItems={pagination.totalDocuments || 0}
        currentPage={pagination.currentPage || 0}
      />
    </div>
  );
}