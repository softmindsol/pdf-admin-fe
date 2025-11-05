import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteWorkOrderMutation,
  useGetWorkOrderByIdQuery,
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter as ShadcnTableFooter, // Renamed to avoid conflict
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { showDeleteConfirm } from "@/lib/swal";

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
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function ViewWorkOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteWorkOrder] = useDeleteWorkOrderMutation();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetWorkOrderByIdQuery(id, {
    skip: !id,
  });

  const workOrder = response?.data?.workOrder;

  // Calculate grand total for materials
  const grandTotal =
    workOrder?.materialList?.reduce(
      (acc, item) => acc + (item.totalCost || 0),
      0
    ) || 0;

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
          <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-2" />
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mt-2" />
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
            Failed to fetch work order data. Please try again later.
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
          Back to Work Orders
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/work-order/update/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              showDeleteConfirm(async () => {
                await deleteWorkOrder(id);
                navigate('/work-order')
              });
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Details Card */}
      {workOrder && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                Job #{workOrder.jobNumber}
              </CardTitle>
              <CardDescription>
                For customer: {workOrder.customerName}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <DetailItem
                label="Customer Name"
                value={workOrder.customerName}
              />
              <DetailItem
                label="Email Address"
                value={workOrder.emailAddress}
              />
              <DetailItem label="Phone Number" value={workOrder.phoneNumber} />
              <DetailItem label="Technician" value={workOrder.technicianName} />
              <DetailItem
                label="Technician Contact"
                value={workOrder.contactNumber}
              />
              <DetailItem
                label="Date of Work"
                value={formatDate(workOrder.date)}
              />
              <DetailItem label="Payment Method">
                <span className="capitalize">
                  {workOrder.paymentMethod.replace("_", " ")}
                </span>
              </DetailItem>
            
            </CardContent>
            <CardFooter className="flex-col items-start text-xs text-gray-500 space-y-1">
              <p>Created On: {formatDate(workOrder.createdAt)}</p>
              <p>Last Updated: {formatDate(workOrder.updatedAt)}</p>
              <p className="pt-2">Work Order ID: {workOrder._id}</p>
            </CardFooter>
          </Card>

          {/* Materials Card */}
          <Card>
            <CardHeader>
              <CardTitle>Materials Used</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Qty</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrder.materialList.length > 0 ? (
                    workOrder.materialList.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-medium">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitCost)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.totalCost)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No materials were recorded for this work order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {workOrder.materialList.length > 0 && (
                  <ShadcnTableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right font-bold text-lg"
                      >
                        Grand Total
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(grandTotal)}
                      </TableCell>
                    </TableRow>
                  </ShadcnTableFooter>
                )}
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
