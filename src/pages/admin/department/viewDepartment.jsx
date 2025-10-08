import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetDepartmentByIdQuery,
} from "@/store/GlobalApi"; // Adjust the import path
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

// --- Shadcn UI Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// --- Helper Components & Functions ---

// Generic helper to display a single detail item
const DetailItem = ({ label, value, children }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="mt-1 text-base text-gray-900">{value || children}</div>
  </div>
);

// Badge for department status
const getStatusBadge = (status) => {
  const baseClasses =
    "px-3 py-1 rounded-full text-sm font-semibold capitalize inline-block";
  switch (status) {
    case "active":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "inactive":
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

// Helper to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ViewDepartment() {
  const { id } = useParams(); // Get the department ID from the URL
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch the department data using the ID
  const {
    data: response,
    isLoading,
    isError,
  } = useGetDepartmentByIdQuery(id, {
    skip: !id, // Skip the query if there's no ID
  });


  // Correctly access the nested department object
  const department = response?.data?.department;



  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch department data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- Success State ---
  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      {/* --- Header --- */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/department')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Departments
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/department/${id}/update`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
         
        </div>
      </div>

      {/* --- Department Details Card --- */}
      {department && (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{department.name}</CardTitle>
            <CardDescription>
              {department.manager
                ? `Managed by ${department.manager.firstName} ${department.manager.lastName}`
                : "No manager assigned"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <DetailItem label="Status">
              <span className={getStatusBadge(department.status)}>
                {department.status}
              </span>
            </DetailItem>

            <DetailItem
  label="Managers" // It's better to make the label plural
  value={
    department.manager?.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {department.manager.map((manager) => (
          <Badge key={manager._id} variant="secondary">
            {manager.firstName} {manager.lastName}
          </Badge>
        ))}
      </div>
    ) : (
      "N/A"
    )
  }
/>

            <DetailItem label="Date Created" value={formatDate(department.createdAt)} />

            <DetailItem label="Last Updated" value={formatDate(department.updatedAt)} />
            
            <DetailItem label="Allowed Forms">
              {department.allowedForms && department.allowedForms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {department.allowedForms.map((form) => (
                    <span
                      key={form}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {form}
                    </span>
                  ))}
                </div>
              ) : (
                "None"
              )}
            </DetailItem>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500">
              Department ID: {department._id}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}