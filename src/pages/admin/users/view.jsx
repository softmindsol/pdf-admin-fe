import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useGetUserByIdQuery } from "@/store/GlobalApi"; // Adjust the import path
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

// --- Helper Components & Functions ---

// Helper to display a single detail item
const UserDetailItem = ({ label, value, children }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="mt-1 text-base text-gray-900">{value || children}</div>
  </div>
);

// Badge for user status
const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold capitalize inline-block";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
};

// Helper to format dates
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};


export default function ViewUser() {
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch the user data using the ID
  const {
      data: response,
      isLoading,
      isError,
    } = useGetUserByIdQuery(id, {
        skip: !id, // Skip the query if there's no ID
    });

    const [deleteUser ]=useDeleteUserMutation()
  // Correctly access the nested user object
  const user = response?.data?.user;

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
           <Skeleton className="h-10 w-32" />
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
          {/* Updated skeleton for 4 items */ }
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
            Failed to fetch user data. Please try again later.
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
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <div className="flex items-center space-x-2">
            <Button onClick={()=>{
              navigate(`/user/${id}/update`)
            }} variant="outline">
                <Edit className="mr-2 h-4 w-4"/>
                Edit
            </Button>
            <Button variant="destructive" onClick={()=>{
              deleteUser(id);
              navigate('/user');
            }}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Delete
            </Button>
        </div>
      </div>

      {/* --- User Details Card --- */}
      {user && (
         <Card>
            <CardHeader>
                <CardTitle className="text-3xl">{`${user.firstName} ${user.lastName}`}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
                
                {/* --- Displaying Role, Status, Department, and Timestamps --- */}
                <UserDetailItem label="Role">
                    <span className="capitalize">{user.role}</span>
                </UserDetailItem>

                <UserDetailItem label="Status">
                    <span className={getStatusBadge(user.status)}>{user.status}</span>
                </UserDetailItem>

                <UserDetailItem label="Department ID" value={user.department} />
                
                <UserDetailItem label="Date Joined" value={formatDate(user.createdAt)} />

                <UserDetailItem label="Last Updated" value={formatDate(user.updatedAt)} />
                
            </CardContent>
            <CardFooter>
                <p className="text-xs text-gray-500">User ID: {user._id}</p>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}