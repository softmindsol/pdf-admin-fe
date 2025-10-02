import React, { useState, useEffect } from "react";
import {
  useFormsQuery,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "@/store/GlobalApi";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function DepartmentsManagement() {
  const navigate = useNavigate();
  const [updateDepartment] = useUpdateDepartmentMutation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetDepartmentsQuery({
    page,
    limit,
    search: debouncedSearch,
  });
  const { data: { data: forms } = {} } = useFormsQuery();
  console.log("🚀 ~ DepartmentsManagement ~ forms:", forms);

  const departments = response?.data?.departments || [];
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
            <Skeleton className="h-4 w-32" />
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
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">
          Manage the departments in your organization.
        </p>
      </div>

      {/* --- Toolbar --- */}
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    Object.keys(rowSelection).length === departments.length &&
                    departments.length > 0
                  }
                  onCheckedChange={(checked) => {
                    const newSelection = {};
                    if (checked) {
                      departments.forEach(
                        (dept) => (newSelection[dept._id] = true)
                      );
                    }
                    setRowSelection(newSelection);
                  }}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              renderSkeletons()
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Failed to load data.
                </TableCell>
              </TableRow>
            ) : departments.length > 0 ? (
              departments.map((department) => (
                <TableRow key={department._id}>
                  <TableCell>
                    <Checkbox
                      checked={rowSelection[department._id] || false}
                      onCheckedChange={(checked) => {
                        const newSelection = { ...rowSelection };
                        if (checked) {
                          newSelection[department._id] = true;
                        } else {
                          delete newSelection[department._id];
                        }
                        setRowSelection(newSelection);
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {department.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {department.manager
                      ? `${department.manager.firstName} ${department.manager.lastName}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className={getStatusBadge(department.status)}>
                      {department.status}
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
                          onClick={() =>
                            navigate(`/department/${department._id}`)
                          }
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/department/${department._id}/update`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            updateDepartment({
                              id: department._id,
                              isDeleted: true,
                            })
                          }
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
        isLoading={isLoading}
        selectedRowCount={Object.keys(rowSelection).length}
        totalItems={pagination.totalDepartments || 0}
        currentPage={pagination.currentPage || 0}
      />
    </div>
  );
}
