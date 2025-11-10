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
                        label="Authorities Accepting Plans"
                        value={ticket.plansAndInstructions?.plans?.acceptedByAuthorities?.join(
                          ", "
                        )}
                      />
                      <DetailItem
                        label="Location of Plans"
                        value={ticket.plansAndInstructions?.plans?.address}
                      />
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
                        className="col-span-full"
                      />
                    </div>
                  </div>
                  <Separator />
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
                      <DetailItem
                        label="Instruction Explanation"
                        value={
                          ticket.plansAndInstructions?.instructions
                            ?.instructionExplanation
                        }
                        className="col-span-full"
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
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md mb-2">Sprinklers</h4>
                    {ticket.systemComponents?.sprinklers?.length > 0 ? (
                      ticket.systemComponents.sprinklers.map((s, i) => (
                        <div
                          key={i}
                          className="p-3 border rounded-md mt-2 space-y-2"
                        >
                          <p className="font-medium">Sprinkler {i + 1}</p>
                          <div className="grid gap-4 sm:grid-cols-3">
                            <DetailItem
                              label="Make/Model"
                              value={`${s.make || "N/A"} / ${s.model || "N/A"}`}
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
                <AccordionContent className="p-2 space-y-6">
                  <div>
                    <h4 className="font-semibold text-md">
                      Alarm Valves / Flow Indicators
                    </h4>
                    {ticket.alarmsAndValves?.alarmValvesOrFlowIndicators
                      ?.length > 0 ? (
                      ticket.alarmsAndValves.alarmValvesOrFlowIndicators.map(
                        (d, i) => (
                          <div
                            key={i}
                            className="p-3 border rounded-md mt-2 grid gap-4 sm:grid-cols-3"
                          >
                            <DetailItem
                              label={`Device ${i + 1} Type`}
                              value={d.type}
                            />
                            <DetailItem
                              label="Make/Model"
                              value={`${d.make || "N/A"} / ${d.model || "N/A"}`}
                            />
                            <DetailItem
                              label="Max Operation Time"
                              value={formatTime(d.maxOperationTime)}
                            />
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        No alarm devices listed.
                      </p>
                    )}
                  </div>

                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md">
                      Dry Pipe Operating Tests
                    </h4>
                    {ticket.alarmsAndValves?.dryPipeOperatingTests?.length >
                    0 ? (
                      ticket.alarmsAndValves.dryPipeOperatingTests.map(
                        (test, i) => (
                          <div
                            key={i}
                            className="p-3 border rounded-md mt-2 space-y-4"
                          >
                            <p className="font-medium">Test {i + 1}</p>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              {/* --- Existing Fields --- */}
                              <DetailItem
                                label="Dry Valve Make/Model"
                                value={`${test.dryValve?.make || "N/A"} / ${
                                  test.dryValve?.model || "N/A"
                                }`}
                              />
                              <DetailItem
                                label="QOD Valve Make/Model"
                                value={`${test.qodValve?.make || "N/A"} / ${
                                  test.qodValve?.model || "N/A"
                                }`}
                              />
                              {/* --- NEWLY ADDED FIELDS --- */}
                              <DetailItem
                                label="Dry Valve Serial #"
                                value={test.dryValve?.serialNumber}
                              />
                              <DetailItem
                                label="QOD Valve Serial #"
                                value={test.qodValve?.serialNumber}
                              />
                              <DetailItem
                                label="Water Pressure (w/o | w/ QOD)"
                                value={`${
                                  test.waterPressureWithoutQOD ?? "N/A"
                                } psi | ${
                                  test.waterPressureWithQOD ?? "N/A"
                                } psi`}
                              />
                              <DetailItem
                                label="Air Pressure (w/o | w/ QOD)"
                                value={`${
                                  test.airPressureWithoutQOD ?? "N/A"
                                } psi | ${
                                  test.airPressureWithQOD ?? "N/A"
                                } psi`}
                              />
                              <DetailItem
                                label="Trip Point Air (w/o | w/ QOD)"
                                value={`${
                                  test.tripPointAirPressureWithoutQOD ?? "N/A"
                                } psi | ${
                                  test.tripPointAirPressureWithQOD ?? "N/A"
                                } psi`}
                              />
                              {/* --- End of Newly Added Fields --- */}
                              <DetailItem
                                label="Time to Trip (without QOD)"
                                value={formatTime(test.timeToTripWithoutQOD)}
                              />
                              <DetailItem
                                label="Time to Trip (with QOD)"
                                value={formatTime(test.timeToTripWithQOD)}
                              />
                              <DetailItem
                                label="Water Reached Outlet (without QOD)"
                                value={formatTime(
                                  test.timeWaterReachedOutletWithoutQOD
                                )}
                              />
                              <DetailItem
                                label="Water Reached Outlet (with QOD)"
                                value={formatTime(
                                  test.timeWaterReachedOutletWithQOD
                                )}
                              />
                              <DetailItem
                                label="Alarm OK (without QOD)"
                                value={formatBoolean(
                                  test.alarmOperatedProperlyWithoutQOD
                                )}
                              />
                              <DetailItem
                                label="Alarm OK (with QOD)"
                                value={formatBoolean(
                                  test.alarmOperatedProperlyWithQOD
                                )}
                              />
                              {/* --- NEWLY ADDED FIELD --- */}
                              <DetailItem
                                label="Alarm Operation Explanation"
                                value={test.explain}
                                className="col-span-full"
                              />
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        No dry pipe operating tests listed.
                      </p>
                    )}
                  </div>

                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md">
                      Deluge & Pre-Action Valves
                    </h4>
                    {ticket.alarmsAndValves?.delugeAndPreActionValves?.length >
                    0 ? (
                      ticket.alarmsAndValves.delugeAndPreActionValves.map(
                        (valve, i) => (
                          <div
                            key={i}
                            className="p-3 border rounded-md mt-2 space-y-4"
                          >
                            <p className="font-medium">Valve {i + 1}</p>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              {/* --- Existing Fields --- */}
                              <DetailItem
                                label="Make/Model"
                                value={`${valve.make || "N/A"} / ${
                                  valve.model || "N/A"
                                }`}
                              />
                              <DetailItem
                                label="Operation Type"
                                value={valve.operation}
                              />
                              <DetailItem
                                label="Piping Supervised?"
                                value={formatBoolean(valve.isPipingSupervised)}
                              />
                              <DetailItem
                                label="Detecting Media Supervised?"
                                value={formatBoolean(
                                  valve.isDetectingMediaSupervised
                                )}
                              />
                              {/* --- NEWLY ADDED FIELDS --- */}
                              <DetailItem
                                label="Operates from Manual/Remote?"
                                value={formatBoolean(
                                  valve.operatesFromManualOrRemote
                                )}
                              />
                              <DetailItem
                                label="Accessible for Testing?"
                                value={formatBoolean(
                                  valve.isAccessibleForTesting
                                )}
                              />
                              {/* --- End of Newly Added Fields --- */}
                              <DetailItem
                                label="Supervision Loss Alarm OK?"
                                value={formatBoolean(
                                  valve.doesSupervisionLossAlarmOperate
                                )}
                              />
                              <DetailItem
                                label="Valve Release OK?"
                                value={formatBoolean(
                                  valve.doesValveReleaseOperate
                                )}
                              />
                              <DetailItem
                                label="Max Time to Operate"
                                value={formatTime(
                                  valve.maxTimeToOperateRelease
                                )}
                              />
                              {/* --- NEWLY ADDED FIELD --- */}
                              <DetailItem
                                label="Explanation"
                                value={valve.explanation}
                                className="col-span-full"
                              />
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        No deluge or pre-action valves listed.
                      </p>
                    )}
                  </div>

                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md">
                      Pressure Reducing Valve Tests
                    </h4>
                    {ticket.alarmsAndValves?.pressureReducingValveTests
                      ?.length > 0 ? (
                      ticket.alarmsAndValves.pressureReducingValveTests.map(
                        (test, i) => (
                          <div
                            key={i}
                            className="p-3 border rounded-md mt-2 space-y-4"
                          >
                            <p className="font-medium">Test {i + 1}</p>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              <DetailItem
                                label="Location & Floor"
                                value={test.locationAndFloor}
                              />
                              <DetailItem
                                label="Make & Model"
                                value={test.makeAndModel}
                              />
                              <DetailItem
                                label="Setting"
                                value={test.setting}
                              />
                              <DetailItem
                                label="Static Pressure (In/Out)"
                                value={`${
                                  test.staticPressure?.inlet || "N/A"
                                } psi / ${
                                  test.staticPressure?.outlet || "N/A"
                                } psi`}
                              />
                              <DetailItem
                                label="Residual Pressure (In/Out)"
                                value={`${
                                  test.residualPressure?.inlet || "N/A"
                                } psi / ${
                                  test.residualPressure?.outlet || "N/A"
                                } psi`}
                              />
                              <DetailItem
                                label="Flow Rate"
                                value={
                                  test.flowRate ? `${test.flowRate} GPM` : "N/A"
                                }
                              />
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        No pressure reducing valve tests listed.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Testing */}
              <AccordionItem value="item-5">
                <AccordionTrigger>Testing</AccordionTrigger>
                <AccordionContent className="p-2 space-y-6">
                  <div>
                    <h4 className="font-semibold text-md">Backflow Test</h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DetailItem
                        label="Means Used"
                        value={ticket.testing?.backflowTest?.meansUsed}
                      />
                      <DetailItem
                        label="Flow Demand Created?"
                        value={
                          ticket.testing?.backflowTest?.wasFlowDemandCreated
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
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
                  </div>
                  <Separator />
                  <div>
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
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md">
                      Blank Testing Gaskets
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <DetailItem
                        label="Number Used"
                        value={ticket.testing?.blankTestingGaskets?.numberUsed}
                      />
                      <DetailItem
                        label="Number Removed"
                        value={
                          ticket.testing?.blankTestingGaskets?.numberRemoved
                        }
                      />
                      <DetailItem
                        label="Locations"
                        value={ticket.testing?.blankTestingGaskets?.locations}
                        className="col-span-full sm:col-span-1"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
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
                        label="No Corrosive Chemicals Used?"
                        value={formatBoolean(
                          ticket.testing?.noCorrosiveChemicalsCertification
                        )}
                      />
                      <DetailItem
                        label="Underground Piping Flushed?"
                        value={formatBoolean(
                          ticket.testing?.undergroundPiping
                            ?.wasFlushedByInstaller
                        )}
                      />
                      <DetailItem
                        label="Underground Piping Verified?"
                        value={formatBoolean(
                          ticket.testing?.undergroundPiping
                            ?.isVerifiedByCertificate
                        )}
                      />
                      <DetailItem
                        label="Powder-Driven Fasteners Test OK?"
                        value={formatBoolean(
                          ticket.testing?.powderDrivenFasteners
                            ?.isTestingSatisfactory
                        )}
                      />
                      <DetailItem
                        label="Improper Operation Reason"
                        value={ticket.testing?.improperOperationReason}
                        className="col-span-full"
                      />
                      {/* --- NEWLY ADDED FIELDS --- */}
                      <DetailItem
                        label="Underground Piping Explanation"
                        value={ticket.testing?.undergroundPiping?.explanation}
                        className="col-span-full"
                      />
                      <DetailItem
                        label="Powder-Driven Fasteners Explanation"
                        value={
                          ticket.testing?.powderDrivenFasteners?.explanation
                        }
                        className="col-span-full"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Welding & Cutouts</AccordionTrigger>
                <AccordionContent className="p-2 space-y-6">
                  <div>
                    <h4 className="font-semibold text-md mb-2">Welding</h4>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      <DetailItem
                        label="Welding Piping?"
                        value={formatBoolean(
                          ticket.weldingAndCutouts?.isWeldingPiping
                        )}
                      />
                      <DetailItem
                        label="AWS B2.1 Compliant?"
                        value={formatBoolean(
                          ticket.weldingAndCutouts?.certifications
                            ?.awsB21Compliant
                        )}
                      />
                      <DetailItem
                        label="Welders Qualified?"
                        value={formatBoolean(
                          ticket.weldingAndCutouts?.certifications
                            ?.weldersQualified
                        )}
                      />
                      <DetailItem
                        label="QC Procedure Compliant?"
                        value={formatBoolean(
                          ticket.weldingAndCutouts?.certifications
                            ?.qualityControlProcedureCompliant
                        )}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md mb-2">Cutouts</h4>
                    <DetailItem
                      label="Retrieval Control for Cutouts?"
                      value={formatBoolean(
                        ticket.weldingAndCutouts?.cutouts?.hasRetrievalControl
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Final Checks</AccordionTrigger>
                <AccordionContent className="p-2 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <DetailItem
                    label="Hydraulic Data Nameplate?"
                    value={formatBoolean(
                      ticket.finalChecks?.hasHydraulicDataNameplate
                    )}
                  />
                  <DetailItem
                    label="Caps & Straps Removed?"
                    value={formatBoolean(
                      ticket.finalChecks?.areCapsAndStrapsRemoved
                    )}
                  />
                  <DetailItem
                    label="Nameplate Explanation"
                    value={ticket.finalChecks?.nameplateExplanation}
                    className="col-span-full"
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Remarks</AccordionTrigger>
                <AccordionContent className="p-2 space-y-4">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <DetailItem
                      label="Sprinkler Contractor Name"
                      value={
                        ticket.remarksAndSignatures?.sprinklerContractorName
                      }
                    />
                    <DetailItem
                      label="Date System Left in Service"
                      value={formatDate(
                        ticket.remarksAndSignatures?.dateLeftInService
                      )}
                    />
                  </div>
                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-md mb-2">
                        Fire Marshal / AHJ
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-3 p-3 border rounded-md">
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
                    <div>
                      <h4 className="font-semibold text-md mb-2">
                        Sprinkler Contractor
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-3 p-3 border rounded-md">
                        <DetailItem
                          label="Name"
                          value={
                            ticket.remarksAndSignatures?.sprinklerContractor
                              ?.name
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
                            ticket.remarksAndSignatures?.sprinklerContractor
                              ?.date
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <DetailItem
                    label="Remarks"
                    value={ticket.remarksAndSignatures?.remarks}
                    className="col-span-full"
                  />
                </AccordionContent>
              </AccordionItem>

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
