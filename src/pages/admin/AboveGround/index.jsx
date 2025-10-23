import React, { useState, useEffect } from "react";
import {
  useGetAboveGroundTestsQuery,
  useDeleteAboveGroundTestMutation,
  useLazyGetSignedUrlQuery, // 1. Import the lazy query hook
} from "@/store/GlobalApi";
import { MoreHorizontal, PlusCircle, Search, Download } from "lucide-react"; // 2. Import Download icon
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner"; // 3. Import toast for notifications

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
import { showDeleteConfirm } from "@/lib/swal";

export default function AboveGroundTestManagement() {
  const navigate = useNavigate();
  const [deleteAboveGroundTest] = useDeleteAboveGroundTestMutation();

  // 4. Instantiate the lazy query hook
  const [triggerGetSignedUrl, { isLoading: isDownloading }] =
    useLazyGetSignedUrlQuery();

  // --- State Management ---
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

  // --- Fetch Data ---
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetAboveGroundTestsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const aboveGroundTests = response?.data?.aboveGroundTests || [];
  const pagination = response?.data?.pagination || {};
  const pageCount = pagination.totalPages || 0;

  // 5. Create the handler function for downloading the PDF
  const handleDownloadPdf = async (test) => {
    // Assuming the PDF file key is stored in a field named 'pdfUrl' or similar
    // You might need to adjust this based on your actual data structure
    if (!test.ticket) {
      toast.error("No PDF found for this test record.");
      return;
    }

    try {
      const apiResponse = await triggerGetSignedUrl(test.ticket).unwrap();
      const signedUrl = apiResponse.data.url;

      // Open the secure URL in a new tab to trigger the download
      window.open(signedUrl, "_blank", "noopener,noreferrer");

      toast.success("Download has started!");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Could not download the PDF. Please try again.");
    }
  };

  // --- Render Skeletons ---
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
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Above Ground Tests
        </h1>
        <p className="text-muted-foreground">
          Manage all above ground sprinkler system tests.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by property name, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8"
          />
        </div>
        <Button onClick={() => navigate("/above-ground/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Test
        </Button>
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead>Property Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contractor</TableHead>
              <TableHead>Date of Test</TableHead>
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
            ) : aboveGroundTests.length > 0 ? (
              aboveGroundTests.map((test) => (
                <TableRow key={test._id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">
                    {test.propertyDetails.propertyName}
                  </TableCell>
                  <TableCell>{test.propertyDetails.propertyAddress}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {test.remarksAndSignatures?.sprinklerContractor?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(test.propertyDetails.date), "PP")}
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
                          onClick={() => navigate(`/above-ground/${test._id}`)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/above-ground/${test._id}/update`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>

                        {/* 6. Add the Download PDF menu item */}
                        <DropdownMenuItem
                          disabled={!test.ticket || isDownloading}
                          onClick={() => handleDownloadPdf(test)}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          <span>Download PDF</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            showDeleteConfirm(async () => {
                              await deleteAboveGroundTest(test._id).unwrap();
                            });
                          }}
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
