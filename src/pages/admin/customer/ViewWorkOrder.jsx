import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteCustomerMutation,
  useGetCustomerByIdQuery,
} from "@/store/GlobalApi";
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
import { Separator } from "@/components/ui/separator";

// --- Helper Components & Functions ---

// Helper to display a single detail item
const DetailItem = ({ label, value, children, className = "" }) => (
  <div className={className}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="mt-1 text-base text-gray-900 break-words">
      {value || children || "N/A"}
    </div>
  </div>
);

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetCustomerByIdQuery(id, {
    skip: !id,
  });

  const customer = response?.data?.customer;

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
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
          <CardContent className="space-y-8">
            {/* Simulate multiple sections */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
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
            Failed to fetch customer data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- Success State ---
  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/customer/update/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={() => {
              deleteCustomer(id);
              navigate("/customer");
            }}
            ariant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Details Card */}
      {customer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{customer.customerName}</CardTitle>
            <CardDescription>
              {customer.typeOfSite} at {customer.siteAddress}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Customer Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem
                  label="Customer Name"
                  value={customer.customerName}
                />
                <DetailItem label="Phone Number" value={customer.phoneNumber} />
                <DetailItem
                  label="Email for Reports"
                  value={customer.emailForInspectionReports}
                />
              </div>
            </div>

            <Separator />

            {/* On-Site Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Site Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem
                  label="Building Name"
                  value={customer.buildingName}
                />
                <DetailItem label="Type of Site" value={customer.typeOfSite} />
                <DetailItem
                  label="Site Address"
                  value={customer.siteAddress}
                  className="md:col-span-3"
                />
                <DetailItem
                  label="On-Site Contact"
                  value={customer.onSiteContactName}
                />
                <DetailItem
                  label="On-Site Phone"
                  value={customer.onSitePhoneNumber}
                />
                <DetailItem
                  label="On-Site Email"
                  value={customer.onSiteEmailAddress}
                />
              </div>
            </div>

            <Separator />

            {/* Billing Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Billing Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem label="Billing Name" value={customer.billingName} />
                <DetailItem
                  label="Billing Phone"
                  value={customer.billingContactNumber}
                />
                <DetailItem
                  label="Billing Email"
                  value={customer.billingEmailAddress}
                />
              </div>
            </div>

            <Separator />

            {/* Owner's Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Owner's Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem label="Owner Name" value={customer.ownerName} />
                <DetailItem
                  label="Owner Phone"
                  value={customer.ownerContactNumber}
                />
                <DetailItem
                  label="Owner Email"
                  value={customer.ownerEmailAddress}
                />
                <DetailItem
                  label="Owner Address"
                  value={customer.ownerAddress}
                  className="md:col-span-3"
                />
              </div>
            </div>

            <Separator />

            {/* Certificates */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Certificates
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem
                  label="Tax Exempt Certificate"
                  value={customer.taxExemptCertificate ? "Yes" : "No"}
                />
                <DetailItem
                  label="Direct Pay Certificate"
                  value={customer.directPayCertificate ? "Yes" : "No"}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-gray-500 space-y-1">
            <p>Created On: {formatDate(customer.createdAt)}</p>
            <p>Last Updated: {formatDate(customer.updatedAt)}</p>
            <p className="pt-2">Customer ID: {customer._id}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
