import React, { useState, useEffect } from "react";
import {
  useGetServiceTicketsQuery,
  useDeleteServiceTicketMutation,
  useLazyGetSignedUrlQuery, // 1. Import the lazy query hook
} from "@/store/GlobalApi";
import { MoreHorizontal, PlusCircle, Search, Download } from "lucide-react"; // Import Download icon
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Toaster, toast } from "sonner"; // For user-friendly notifications

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
import { DataTablePagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { showDeleteConfirm } from "@/lib/swal";

export default function ServiceTicketManagement() {
  const navigate = useNavigate();
  const [deleteServiceTicket] = useDeleteServiceTicketMutation();

  // 2. Instantiate the lazy query hook for on-demand URL fetching
  const [triggerGetSignedUrl, { isLoading: isDownloading }] =
    useLazyGetSignedUrlQuery();

  // --- State Management for Filters ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(searchTerm);
    }, 500);
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

  // 3. Create the handler function for downloading the PDF
  const handleDownloadPdf = async (ticket) => {
    if (!ticket.ticket) {
      toast.error("No PDF found for this service ticket.");
      return;
    }


    try {
      // Get the temporary, secure URL from the backend
      const apiResponse = await triggerGetSignedUrl(ticket.ticket).unwrap();
      const signedUrl = apiResponse.data.url;

      // Fetch the file data from S3 as a blob
     window.open(signedUrl, '_blank', 'noopener,noreferrer');
    
        // You can still provide feedback.
      toast.success("Download has started!");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.dismiss();
      toast.error("Could not download the PDF. Please try again.");
    }
  };

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
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by job, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8"
          />
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
                <Checkbox />
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
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">
                    {ticket.jobName}
                  </TableCell>
                  <TableCell>{ticket.customerName}</TableCell>
                  <TableCell>{ticket.technicianName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.workOrderStatus === "Complete"
                          ? "default"
                          : "secondary"
                      }
                    >
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
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/service-ticket/${ticket._id}`)
                          }
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
                        {/* 4. Add the Download PDF menu item */}
                        <DropdownMenuItem
                          disabled={!ticket.ticket || isDownloading}
                          onClick={() => handleDownloadPdf(ticket)}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          <span>Download PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            showDeleteConfirm(() =>
                              deleteServiceTicket(ticket._id).unwrap()
                            )
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
        totalItems={pagination.totalDocuments || 0}
        currentPage={pagination.currentPage || 0}
      />
    </div>
  );
}
