import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetDepartmentsQuery, // --- ADDED: Import hook to get departments
} from "@/store/GlobalApi";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
import { showDeleteConfirm } from "@/lib/swal";
import { getUserData } from "@/lib/auth";

export default function UsersManagement() {
  const navigate = useNavigate();
  const [updateUser] = useUpdateUserMutation();

  // --- State Management for Filters ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(""); // --- ADDED: State for department filter
  const [rowSelection, setRowSelection] = useState({});
const user=getUserData()
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- ADDED: Fetch all departments for the filter dropdown ---
  const { data: departmentResponse, isLoading: areDepartmentsLoading } =
    useGetDepartmentsQuery({ page: 0 });
  const departments = departmentResponse?.data?.departments || [];

  // --- UPDATED: Added department filter to the query ---
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch,
    ...(roleFilter && roleFilter !== "all" && { role: roleFilter }),
    ...(departmentFilter &&
      departmentFilter !== "all" && { department: departmentFilter }),
  });

  const users = response?.data?.users || [];
  const pagination = response?.data?.pagination || {};
  const pageCount = pagination.totalPages || 0;

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-2 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

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
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
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
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage the users in your system.
        </p>
      </div>

      {/* --- Toolbar --- */}
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {!user?.department && <SelectItem value="admin">Admin</SelectItem>}
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          {/* --- ADDED: Department Filter --- */}
        {!user?.department &&   <Select
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
          </Select>}
        </div>
        <Button onClick={() => navigate("/user/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
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
                    Object.keys(rowSelection).length === users.length &&
                    users.length > 0
                  }
                  onCheckedChange={(checked) => {
                    const newSelection = {};
                    if (checked) {
                      users.forEach((user) => (newSelection[user._id] = true));
                    }
                    setRowSelection(newSelection);
                  }}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
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
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Checkbox
                      checked={rowSelection[user._id] || false}
                      onCheckedChange={(checked) => {
                        const newSelection = { ...rowSelection };
                        if (checked) {
                          newSelection[user._ed] = true;
                        } else {
                          delete newSelection[user._id];
                        }
                        setRowSelection(newSelection);
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell className="text-muted-foreground">
                    @{user.username}
                  </TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="capitalize">{user?.department?.name || "N/A"}</TableCell>
                  <TableCell>
                    <span className={getStatusBadge(user.status)}>
                      {user.status}
                    </span>
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
                          onClick={() => navigate(`/user/${user?._id}`)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/user/${user?._id}/update`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={async () => {
                          showDeleteConfirm(async ()=>{await updateUser({
                              id: user?._id,
                              isDeleted: true,
                            }).unwrap()})
                             
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
        isLoading={isLoading}
        selectedRowCount={Object.keys(rowSelection).length}
        totalItems={pagination.totalUsers || 0}
        currentPage={pagination.currentPage || 0}
      />
    </div>
  );
}
