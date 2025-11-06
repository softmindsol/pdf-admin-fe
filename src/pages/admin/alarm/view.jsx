import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAlarmByIdQuery,
  useDeleteAlarmMutation,
} from "@/store/GlobalApi"; // 1. Use Alarm hooks
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  });
};

export default function ViewAlarm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteAlarm] = useDeleteAlarmMutation(); // 2. Use Alarm mutation

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAlarmByIdQuery(id, {
    // 3. Use Alarm query
    skip: !id,
  });

  const alarm = response?.data?.alarm; // 4. Get 'alarm' data

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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <Skeleton className="h-12 w-full" />
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
            Failed to fetch alarm data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- Success State ---
  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      {/* 5. Update titles and navigation paths for Alarms */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Alarms
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/alarm/update/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            onClick={() => {
              showDeleteConfirm(async () => {
                await deleteAlarm(id);
                navigate("/alarm");
              });
            }}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {alarm && (
        <Card>
          {/* 6. Display alarm-specific data in the header */}
          <CardHeader>
            <CardTitle className="text-3xl">
              Account: {alarm.accountNumber}
            </CardTitle>
            <CardDescription>
              Subscriber: {alarm.subscriberName} at {alarm.installationAddress}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* --- Account & Dealer Section --- */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Account & Dealer Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <DetailItem
                  label="Account Number"
                  value={alarm.accountNumber}
                />
                <DetailItem label="Dealer Name" value={alarm.dealerName} />
                <DetailItem label="Dealer Code" value={alarm.dealerCode} />
                <DetailItem
                  label="Start Date"
                  value={formatDate(alarm.startDate)}
                />
                <DetailItem label="Communicator Format" value={alarm.communicatorFormat} />
              </div>
            </div>

            <Separator />

            {/* --- Subscriber & Location Section --- */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Subscriber & Location
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <DetailItem
                  label="Subscriber Name"
                  value={alarm.subscriberName}
                  className="md:col-span-2"
                />
                <DetailItem
                  label="Address"
                  value={alarm.installationAddress}
                  className="md:col-span-2"
                />
                <DetailItem label="City" value={alarm.city} />
                <DetailItem label="State" value={alarm.state} />
                <DetailItem label="ZIP Code" value={alarm.zip} />
              </div>
            </div>

            <Separator />

            {/* --- Communicator Zones Section --- */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Communicator Zones
              </h3>
              {alarm.areas &&
              alarm.areas.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Area #</TableHead>
                        <TableHead>Zone #</TableHead>
                        <TableHead>Zone Description</TableHead>
                        <TableHead>Partition Description</TableHead>
                        <TableHead>Instr 1</TableHead>
                        <TableHead>Instr 2</TableHead>
                        <TableHead>Instr 3</TableHead>
                        <TableHead>Instr 4</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alarm.areas.map((zone, index) => (
                        <TableRow key={zone._id || index}>
                          <TableCell>{zone.areaNumber}</TableCell>
                          <TableCell>{zone.zoneNumber}</TableCell>
                          <TableCell>{zone.zoneDescription || "N/A"}</TableCell>
                          <TableCell>
                            {zone.partitionAreaDescription || "N/A"}
                          </TableCell>
                          <TableCell>{zone.instruction1}</TableCell>
                          <TableCell>{zone.instruction2}</TableCell>
                          <TableCell>{zone.instruction3}</TableCell>
                          <TableCell>{zone.instruction4}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500">
                  No communicator zones are configured for this alarm.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-gray-500 space-y-1">
            <p>Created On: {formatDate(alarm.createdAt)}</p>
            <p>Last Updated: {formatDate(alarm.updatedAt)}</p>
            <p className="pt-2">Alarm ID: {alarm._id}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
