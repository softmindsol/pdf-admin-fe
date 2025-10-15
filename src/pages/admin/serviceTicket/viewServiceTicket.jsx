import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteServiceTicketMutation,
  useGetServiceTicketByIdQuery,
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
import { Badge } from "@/components/ui/badge";

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

export default function ViewServiceTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteServiceTicket] = useDeleteServiceTicketMutation();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetServiceTicketByIdQuery(id, {
    skip: !id,
  });

  const ticket = response?.data?.serviceTicket;

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
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
            {[...Array(5)].map((_, i) => (
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
            Failed to fetch service ticket data. Please try again later.
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
          Back to Service Tickets
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/service-ticket/update/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={() => {
              deleteServiceTicket(id);
              navigate("/service-ticket");
            }}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Details Card */}
      {ticket && (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{ticket.jobName}</CardTitle>
            <CardDescription>
              For {ticket.customerName} at {ticket.jobLocation}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Job & Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Job & Customer Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem label="Job Name" value={ticket.jobName} />
                <DetailItem label="Customer Name" value={ticket.customerName} />
                <DetailItem label="Phone Number" value={ticket.phoneNumber} />
                <DetailItem label="Email Address" value={ticket.emailAddress} />
                <DetailItem
                  label="Job Location"
                  value={ticket.jobLocation}
                  className="md:col-span-2"
                />
              </div>
            </div>

            <Separator />
            
            {/* Work Description */}
             <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Work Description
              </h3>
              <div className="grid gap-6">
                <DetailItem value={ticket.workDescription} />
              </div>
            </div>
            
            <Separator />

            {/* Materials Used */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Materials Used
              </h3>
              <div className="grid gap-4">
                {ticket.materials && ticket.materials.length > 0 ? (
                    ticket.materials.map((item, index) => (
                        <div key={item._id || index} className="flex justify-between items-center text-base p-2 border-b">
                            <span>{item.material}</span>
                            <span className="font-mono text-gray-700">Qty: {item.quantity}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No materials were listed for this job.</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Labor Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Labor Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <DetailItem label="Technician Name" value={ticket.technicianName} />
                <DetailItem label="Technician Contact" value={ticket.technicianContactNumber} />
                <DetailItem label="Straight Time Hours" value={`${ticket.stHours} hrs`} />
                <DetailItem label="Overtime Hours" value={`${ticket.otHours} hrs`} />
              </div>
            </div>

            <Separator />

            {/* Status & Financials */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Status & Financials
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem label="Work Status">
                    <Badge variant={ticket.workOrderStatus === 'Complete' ? 'default' : 'secondary'}>
                        {ticket.workOrderStatus}
                    </Badge>
                </DetailItem>
                <DetailItem
                  label="Completion Date"
                  value={formatDate(ticket.completionDate)}
                />
                <DetailItem
                  label="Sales Tax Applied"
                  value={ticket.applySalesTax ? "Yes" : "No"}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-gray-500 space-y-1">
            <p>Created On: {formatDate(ticket.createdAt)} by {ticket.createdBy?.username || 'N/A'}</p>
            <p>Last Updated: {formatDate(ticket.updatedAt)}</p>
            <p className="pt-2">Ticket ID: {ticket._id}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}