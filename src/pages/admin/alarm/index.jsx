import React, { useState, useEffect } from "react";
import {
  useGetAlarmsQuery,
  useDeleteAlarmMutation,
  useGetDepartmentsQuery,
  useLazyGetSignedUrlQuery, // <-- 1. Import the correct hook for signing URLs
} from "@/store/GlobalApi";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Download, // <-- 2. Import the Download icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner"; // <-- 3. Import toast for notifications

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
import { showDeleteConfirm } from "@/lib/swal";
import { getUserData } from "@/lib/auth";

export default function AlarmManagement() {
  const navigate = useNavigate();
  const [deleteAlarm] = useDeleteAlarmMutation();
  // --- 4. Instantiate the hook to get a signed URL ---
  const [triggerGetSignedUrl, { isLoading: isDownloading }] =
    useLazyGetSignedUrlQuery();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const user = getUserData();

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

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetAlarmsQuery({
    page,
    limit,
    search: debouncedSearch,
    department:
      departmentFilter && departmentFilter !== "all"
        ? departmentFilter
        : undefined,
    startDate,
    endDate,
  });

  const alarms = response?.data?.alarms || [];
  const pagination = response?.data?.pagination || {};
  const pageCount = pagination.totalPages || 0;

  // --- 5. Create the handler function to open the signed PDF URL ---
  const handleDownloadPdf = async (alarm) => {
    if (!alarm.ticket) {
      toast.error("No PDF found for this alarm record.");
      return;
    }
    try {
      // Trigger the backend to get a temporary, secure URL for the file
      const apiResponse = await triggerGetSignedUrl(alarm.ticket).unwrap();
      const signedUrl = apiResponse.data.url;

      // Open the URL in a new browser tab
      window.open(signedUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening PDF...");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Could not open the PDF. Please try again.");
    }
  };

  const renderSkeletons = () =>
    Array(limit)
      .fill(0)
      .map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
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
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ));

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      {/* Header and Filters are unchanged */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alarms</h1>
        <p className="text-muted-foreground">
          Manage all alarm system records.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[250px] max-w-xs sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by account, subscriber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          {user?.role === "admin" && (
            <Select
              value={departmentFilter}
              onValueChange={(value) => {
                setDepartmentFilter(value);
                setPage(1);
              }}
              disabled={areDepartmentsLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-muted-foreground whitespace-nowrap"
            >
              From
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-[150px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-muted-foreground whitespace-nowrap"
            >
              To
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-[150px]"
            />
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => navigate("/alarm/new")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Alarm
          </Button>
        </div>
      </div>
      <div className="rounded-md border pl-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>Subscriber Name</TableHead>
              <TableHead>Dealer Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              renderSkeletons()
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Failed to load alarms.
                </TableCell>
              </TableRow>
            ) : alarms.length > 0 ? (
              alarms.map((alarm) => (
                <TableRow key={alarm._id}>
                  <TableCell className="font-medium">
                    {alarm.accountNumber}
                  </TableCell>
                  <TableCell>{alarm.subscriberName}</TableCell>
                  <TableCell>{alarm.dealerName}</TableCell>
                  <TableCell>{alarm.city}</TableCell>
                  <TableCell>
                    {format(new Date(alarm.startDate), "PPP")}
                  </TableCell>
                  <TableCell>{alarm.createdBy?.username || "N/A"}</TableCell>
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
                          onClick={() => navigate(`/alarm/${alarm._id}`)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/alarm/update/${alarm._id}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        {/* --- 6. Add the Download PDF menu item --- */}
                        <DropdownMenuItem
                          disabled={!alarm.ticket || isDownloading}
                          onClick={() => handleDownloadPdf(alarm)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            showDeleteConfirm(() =>
                              deleteAlarm(alarm._id).unwrap()
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
      <DataTablePagination
        page={page}
        setPage={setPage}
        pageCount={pageCount}
        isLoading={isLoading || isFetching}
        totalItems={pagination.totalDocuments || 0}
        currentPage={pagination.currentPage || 0}
      />
    </div>
  );
}
