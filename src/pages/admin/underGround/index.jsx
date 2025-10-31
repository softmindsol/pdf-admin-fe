import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { MoreHorizontal, PlusCircle, Search, Download } from "lucide-react";
import { toast } from "sonner";

import {
  useGetUndergroundTestsQuery,
  useDeleteUndergroundTestMutation,
  useLazyGetSignedUrlQuery,
  useGetDepartmentsQuery,
} from "@/store/GlobalApi";
import { showDeleteConfirm } from "@/lib/swal";
import { getUserData } from "@/lib/auth";

// --- UI Component Imports ---
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

export default function UndergroundTestManagement() {
  const navigate = useNavigate();

  // --- State Management ---
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

  // --- RTK Query Hooks ---
  const [deleteUndergroundTest] = useDeleteUndergroundTestMutation();
  const [triggerGetSignedUrl, { isLoading: isDownloading }] =
    useLazyGetSignedUrlQuery();

  const { data: departmentResponse, isLoading: areDepartmentsLoading } =
    useGetDepartmentsQuery({ page: 0 });
  const departments = departmentResponse?.data?.departments || [];

  // 2. UPDATED: Pass date filters to the RTK Query hook
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetUndergroundTestsQuery({
    page,
    limit,
    search: debouncedSearch,
    department: departmentFilter && departmentFilter !== "all" ? departmentFilter : undefined,
    startDate, // Pass startDate state
    endDate,   // Pass endDate state
  });

  const undergroundTests = response?.data?.undergroundTests || [];
  const pagination = response?.data?.pagination || {};
  const pageCount = pagination.totalPages || 0;

  const handleDownloadPdf = async (test) => {
    if (!test.ticket) {
      toast.error("No PDF report found for this test.");
      return;
    }
    try {
      const apiResponse = await triggerGetSignedUrl(test.ticket).unwrap();
      const signedUrl = apiResponse.data.url;
      window.open(signedUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening PDF report...");
    } catch (error) {
      console.error("Failed to get signed URL for PDF:", error);
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
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ));
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Underground Tests</h1>
        <p className="text-muted-foreground">Manage all underground fire protection system tests.</p>
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
              placeholder="Search by property name, address..."
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
          <Button onClick={() => navigate("/under-ground/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Test
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border pl-1">
        <Table>
          {/* TableHeader and TableBody remain the same */}
          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contractor</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              renderSkeletons()
            ) : isError ? (
              <TableRow><TableCell colSpan={7} className="h-24 text-center">Failed to load data.</TableCell></TableRow>
            ) : undergroundTests.length > 0 ? (
              undergroundTests.map((test) => (
                <TableRow key={test._id}>
                  <TableCell className="font-medium">{test.propertyDetails.propertyName}</TableCell>
                  <TableCell>{test.propertyDetails.propertyAddress}</TableCell>
                  <TableCell className="text-muted-foreground">{test.remarks.nameOfInstallingContractor || "N/A"}</TableCell>
                  <TableCell>{test.createdBy?.username || "N/A"}</TableCell>
                  <TableCell>{format(new Date(test.createdAt), "PP")}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/under-ground/${test._id}`)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/under-ground/update/${test._id}`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem disabled={!test.ticket || isDownloading} onClick={() => handleDownloadPdf(test)}>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { showDeleteConfirm(() => deleteUndergroundTest(test._id).unwrap()); }} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} className="h-24 text-center">No results found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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