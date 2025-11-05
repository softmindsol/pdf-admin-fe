import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteAboveGroundTestMutation,
  useGetAboveGroundTestByIdQuery,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { showDeleteConfirm } from "@/lib/swal";

// --- Helper Components & Functions ---

const DetailItem = ({ label, value, children, className = "" }) => (
  <div className={className}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="mt-1 text-base text-gray-900 break-words">
      {value ?? children ?? "N/A"}
    </div>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatBoolean = (value) => (value ? "Yes" : "No");

const formatTime = (timeObj) => {
  if (!timeObj || (timeObj.min == null && timeObj.sec == null)) return "N/A";
  return `${timeObj.min ?? 0} min ${timeObj.sec ?? 0} sec`;
};

// --- Main Component ---

export default function ViewAboveGroundTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteAboveGroundTest] = useDeleteAboveGroundTestMutation();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAboveGroundTestByIdQuery(id, { skip: !id });

  // Note: The API response key might be `aboveGroundTest` or `ticket`. Adjust if needed.
  const ticket = response?.data?.ticket || response?.data?.aboveGroundTest;

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
          <CardContent className="space-y-4 pt-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
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
            Failed to fetch test data. Please try again later.
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
          Back to All Tests
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/above-ground/${id}/update`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={() => {
              showDeleteConfirm(async () => {
                await deleteAboveGroundTest(id);
                navigate("/above-ground");
              });
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
            <CardTitle className="text-3xl">
              {ticket.propertyDetails?.propertyName}
            </CardTitle>
            <CardDescription>
              Above Ground Test Report conducted on{" "}
              {formatDate(ticket.propertyDetails?.date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={["item-1"]}
              className="w-full"
            >
              {/* Property Details */}
              <AccordionItem value="item-1">
                <AccordionTrigger>Property Details</AccordionTrigger>
                <AccordionContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 p-2">
                  <DetailItem
                    label="Property Name"
                    value={ticket.propertyDetails?.propertyName}
                  />
                  <DetailItem
                    label="Date of Test"
                    value={formatDate(ticket.propertyDetails?.date)}
                  />
                  <DetailItem
                    label="Property Address"
                    value={ticket.propertyDetails?.propertyAddress}
                  />
                  <DetailItem
                    label="New Installation?"
                    value={formatBoolean(
                      ticket.propertyDetails?.isNewInstallation
                    )}
                  />
                  <DetailItem
                    label="Modification?"
                    value={formatBoolean(
                      ticket.propertyDetails?.isModification
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Plans & Instructions */}
              <AccordionItem value="item-2">
                <AccordionTrigger>Plans & Instructions</AccordionTrigger>
                <AccordionContent className="space-y-6 p-2">
                  <div>
                    <h4 className="font-semibold text-md mb-2">Plans</h4>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      <DetailItem
                        label="Conforms to Accepted Plans?"
                        value={formatBoolean(
                          ticket.plansAndInstructions?.plans
                            ?.conformsToAcceptedPlans
                        )}
                      />
                      <DetailItem
                        label="Equipment Approved?"
                        value={formatBoolean(
                          ticket.plansAndInstructions?.plans
                            ?.equipmentIsApproved
                        )}
                      />
                      <DetailItem
                        label="Deviations Explanation"
                        value={
                          ticket.plansAndInstructions?.plans
                            ?.deviationsExplanation
                        }
                      />
                      <DetailItem
                        label="Location"
                        value={
                          ticket.plansAndInstructions?.plans
                            ?.address
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-md mb-2">Instructions</h4>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      <DetailItem
                        label="Person in Charge Instructed?"
                        value={formatBoolean(
                          ticket.plansAndInstructions?.instructions
                            ?.isPersonInChargeInstructed
                        )}
                      />
                      <DetailItem
                        label="System Comp. Instructions Provided?"
                        value={formatBoolean(
                          ticket.plansAndInstructions?.instructions
                            ?.hasSystemComponentsInstructions
                        )}
                      />
                      <DetailItem
                        label="Care & Maint. Instructions Provided?"
                        value={formatBoolean(
                          ticket.plansAndInstructions?.instructions
                            ?.hasCareAndMaintenanceInstructions
                        )}
                      />
                      <DetailItem
                        label="Copy of NFPA 25 Provided?"
                        value={formatBoolean(
                          ticket.plansAndInstructions?.instructions?.hasNFPA25
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* System Components */}
              <AccordionItem value="item-3">
                <AccordionTrigger>System Components</AccordionTrigger>
                <AccordionContent className="space-y-6 p-2">
                  <div>
                    <h4 className="font-semibold text-md mb-2">
                      Pipe & Fittings
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DetailItem
                        label="Pipe Type"
                        value={
                          ticket.systemComponents?.pipeAndFittings?.pipeType
                        }
                      />
                      <DetailItem
                        label="Fittings Type"
                        value={
                          ticket.systemComponents?.pipeAndFittings?.fittingsType
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-md mb-2">Sprinklers</h4>
                    {ticket.systemComponents?.sprinklers?.length > 0 ? (
                      ticket.systemComponents.sprinklers.map((s, i) => (
                        <div
                          key={i}
                          className="p-2 border rounded-md mt-2 space-y-2"
                        >
                          <p className="font-medium">Sprinkler {i + 1}</p>
                          <div className="grid gap-4 sm:grid-cols-3">
                            <DetailItem
                              label="Make/Model"
                              value={`${s.make} / ${s.model}`}
                            />
                            <DetailItem label="Year" value={s.yearOfMfg} />
                            <DetailItem label="Quantity" value={s.quantity} />
                            <DetailItem
                              label="Orifice Size"
                              value={s.orificeSize}
                            />
                            <DetailItem
                              label="Temp. Rating"
                              value={s.tempRating}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No sprinklers listed.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Alarms & Valves */}
              <AccordionItem value="item-4">
                <AccordionTrigger>Alarms & Valves</AccordionTrigger>
                <AccordionContent className="p-2 space-y-4">
                  {/* You can create more sub-accordions here if needed for clarity */}
                  <h4 className="font-semibold text-md">
                    Alarm Valves / Flow Indicators
                  </h4>
                  {ticket.alarmsAndValves?.alarmValvesOrFlowIndicators?.length >
                  0 ? (
                    ticket.alarmsAndValves.alarmValvesOrFlowIndicators.map(
                      (d, i) => (
                        <div
                          key={i}
                          className="p-2 border rounded-md grid gap-4 sm:grid-cols-3"
                        >
                          <DetailItem
                            label={`Device ${i + 1} Type`}
                            value={d.type}
                          />
                          <DetailItem
                            label="Make/Model"
                            value={`${d.make} / ${d.model}`}
                          />
                          <DetailItem
                            label="Max Operation Time"
                            value={formatTime(d.maxOperationTime)}
                          />
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No alarm devices listed.
                    </p>
                  )}
                  {/* Add similar mapping for dryPipeOperatingTests, delugeAndPreActionValves etc. */}
                </AccordionContent>
              </AccordionItem>

              {/* Testing */}
              <AccordionItem value="item-5">
                <AccordionTrigger>Testing</AccordionTrigger>
                <AccordionContent className="p-2 space-y-4">
                  <h4 className="font-semibold text-md">Hydrostatic Test</h4>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <DetailItem
                      label="Pressure (PSI)"
                      value={ticket.testing?.hydrostaticTest?.pressurePsi}
                    />
                    <DetailItem
                      label="Pressure (Bar)"
                      value={ticket.testing?.hydrostaticTest?.pressureBar}
                    />
                    <DetailItem
                      label="Duration (Hours)"
                      value={ticket.testing?.hydrostaticTest?.durationHrs}
                    />
                  </div>
                  <Separator />
                  <h4 className="font-semibold text-md">Drain Test</h4>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                    <DetailItem
                      label="Gauge Reading (PSI)"
                      value={ticket.testing?.drainTest?.gaugeReadingPsi}
                    />
                    <DetailItem
                      label="Gauge Reading (Bar)"
                      value={ticket.testing?.drainTest?.gaugeReadingBar}
                    />
                    <DetailItem
                      label="Residual Pressure (PSI)"
                      value={ticket.testing?.drainTest?.residualPressurePsi}
                    />
                    <DetailItem
                      label="Residual Pressure (Bar)"
                      value={ticket.testing?.drainTest?.residualPressureBar}
                    />
                  </div>
                  <Separator />
                  <h4 className="font-semibold text-md">General Tests</h4>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <DetailItem
                      label="Dry Piping Pneumatically Tested?"
                      value={formatBoolean(
                        ticket.testing?.isDryPipingPneumaticallyTested
                      )}
                    />
                    <DetailItem
                      label="Equipment Operates Properly?"
                      value={formatBoolean(
                        ticket.testing?.doesEquipmentOperateProperly
                      )}
                    />
                    <DetailItem
                      label="Underground Piping Flushed?"
                      value={formatBoolean(
                        ticket.testing?.undergroundPiping?.wasFlushedByInstaller
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ... Add other sections like Welding, Final Checks similarly ... */}

              {/* Remarks & Signatures */}
              <AccordionItem value="item-8">
                <AccordionTrigger>Remarks & Signatures</AccordionTrigger>
                <AccordionContent className="p-2 space-y-4">
                  <DetailItem
                    label="Remarks"
                    value={ticket.remarksAndSignatures?.remarks}
                    className="col-span-full"
                  />
                  <Separator />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-md mb-2">
                        Sprinkler Contractor
                      </h4>
                      <DetailItem
                        label="Name"
                        value={
                          ticket.remarksAndSignatures?.sprinklerContractor?.name
                        }
                      />
                      <DetailItem
                        label="Title"
                        value={
                          ticket.remarksAndSignatures?.sprinklerContractor
                            ?.title
                        }
                      />
                      <DetailItem
                        label="Date Signed"
                        value={formatDate(
                          ticket.remarksAndSignatures?.sprinklerContractor?.date
                        )}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-md mb-2">
                        Fire Marshal / AHJ
                      </h4>
                      <DetailItem
                        label="Name"
                        value={
                          ticket.remarksAndSignatures?.fireMarshalOrAHJ?.name
                        }
                      />
                      <DetailItem
                        label="Title"
                        value={
                          ticket.remarksAndSignatures?.fireMarshalOrAHJ?.title
                        }
                      />
                      <DetailItem
                        label="Date Signed"
                        value={formatDate(
                          ticket.remarksAndSignatures?.fireMarshalOrAHJ?.date
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Notes */}
              <AccordionItem value="item-9">
                <AccordionTrigger>Notes</AccordionTrigger>
                <AccordionContent className="p-2">
                  <DetailItem label="Additional Notes" value={ticket.notes} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-gray-500 space-y-1 pt-6">
            <p>
              Created On: {formatDate(ticket.createdAt)} by{" "}
              {ticket.createdBy?.username || "N/A"}
            </p>
            <p>Last Updated: {formatDate(ticket.updatedAt)}</p>
            <p className="pt-2">Test ID: {ticket._id}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
