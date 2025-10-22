import React, { useState, useEffect } from "react";
import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
  useLazyGetSignedUrlQuery, // CORRECT: This is the hook for on-demand actions
} from "@/store/GlobalApi"; // Adjust path to your RTK Query API slice
import { MoreHorizontal, PlusCircle, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { DataTablePagination } from "@/components/pagination"; // Your custom pagination component
import { showDeleteConfirm } from "@/lib/swal"; // Your custom Swal confirmation

export default function CustomerManagement() {
  const navigate = useNavigate();
  const [deleteCustomer] = useDeleteCustomerMutation();

  // CORRECT: Call the lazy query hook, which returns an array [trigger, result]
  const [triggerGetSignedUrl, { isLoading: isDownloading }] =
    useLazyGetSignedUrlQuery();

  // --- State Management for Filters and Selection ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1); // Reset to the first page on a new search
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- Fetch Customers Data ---
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetCustomersQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const customers = response?.data?.customers || [];
  const pagination = response?.data?.pagination || {};
  const pageCount = pagination.totalPages || 0;

  // --- Handler for Securely Downloading the PDF ---
const handleDownloadPdf = async (customer) => {
  if (!customer.ticket) {
    toast.error("No PDF profile found for this customer.");
    return;
  }

  try {
    const apiResponse = await triggerGetSignedUrl(customer.ticket).unwrap();
    const signedUrl = apiResponse.data.url;

    // Simply open the secure URL in a new tab.
    // The browser will use its PDF viewer.
    window.open(signedUrl, '_blank', 'noopener,noreferrer');

    // You can still provide feedback.
    toast.success("Opening PDF profile...");
  } catch (error) {
    console.error("Failed to get signed URL:", error);
    toast.error("Could not open the PDF. Please try again.");
  }
};

  // --- UI Rendering ---
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
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      <Toaster richColors position="top-right" />

      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage all customers in the system.
        </p>
      </div>

      {/* --- Toolbar --- */}
      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8"
          />
        </div>
        <Button onClick={() => navigate("/customer/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
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
                    Object.keys(rowSelection).length === customers.length &&
                    customers.length > 0
                  }
                  onCheckedChange={(checked) => {
                    const newSelection = {};
                    if (checked) {
                      customers.forEach(
                        (customer) => (newSelection[customer._id] = true)
                      );
                    }
                    setRowSelection(newSelection);
                  }}
                />
              </TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email for Reports</TableHead>
              <TableHead>Building Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              renderSkeletons()
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Failed to load data.
                </TableCell>
              </TableRow>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <Checkbox
                      checked={rowSelection[customer._id] || false}
                      onCheckedChange={(checked) => {
                        const newSelection = { ...rowSelection };
                        if (checked) newSelection[customer._id] = true;
                        else delete newSelection[customer._id];
                        setRowSelection(newSelection);
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.customerName}
                  </TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.emailForInspectionReports}
                  </TableCell>
                  <TableCell>{customer.buildingName}</TableCell>
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
                          onClick={() => navigate(`/customer/${customer._id}`)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/customer/update/${customer._id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!customer.ticket || isDownloading}
                          onClick={() => handleDownloadPdf(customer)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            showDeleteConfirm(() =>
                              deleteCustomer(customer._id).unwrap()
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
                <TableCell colSpan={6} className="h-24 text-center">
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
        totalItems={pagination.totalCustomers || 0}
        currentPage={pagination.currentPage || 0}
      />
    </div>
  );
}
