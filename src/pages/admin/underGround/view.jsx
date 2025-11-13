import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUndergroundTestByIdQuery,
  useDeleteUndergroundTestMutation,
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

const DetailItem = ({ label, value, children, className = "" }) => {
  const content = value ?? children;
  // Display -- for null, undefined, or empty strings.
  const displayContent =
    content === null || content === undefined || content === ""
      ? "--"
      : content;

  return (
    <div className={className}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-1 text-base text-gray-900 break-words">
        {displayContent}
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "--";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatBoolean = (value) => {
  if (value === null || typeof value === "undefined") {
    return "No";
  }
  return value ? "Yes" : "No";
};

// --- Main Component ---

export default function ViewUndergroundTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteUndergroundTest] = useDeleteUndergroundTestMutation();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetUndergroundTestByIdQuery(id, { skip: !id });

  const testData = response?.data?.undergroundTest;

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
            {[...Array(10)].map((_, i) => (
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
            onClick={() => navigate(`/under-ground/update/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={() => {
              showDeleteConfirm(async () => {
                await deleteUndergroundTest(id);
                navigate("/under-ground");
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
      {testData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {testData.propertyDetails?.propertyName || "--"}
            </CardTitle>
            <CardDescription>
              Underground Test Report conducted on{" "}
              {formatDate(testData.propertyDetails?.date)}
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
                    value={testData.propertyDetails?.propertyName}
                  />
                  <DetailItem
                    label="Date of Test"
                    value={formatDate(testData.propertyDetails?.date)}
                  />
                  <DetailItem
                    label="Property Address"
                    value={testData.propertyDetails?.propertyAddress}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Plans & Instructions */}
              <AccordionItem value="item-2">
                <AccordionTrigger>Plans & Instructions</AccordionTrigger>
                <AccordionContent className="space-y-6 p-2">
                  <div>
                    <h4 className="font-semibold text-md mb-2">Plans</h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DetailItem
                        label="Authorities Accepting Plans"
                        value={testData.plans?.acceptedByApprovingAuthorities?.join(
                          ", "
                        )}
                      />
                      <DetailItem
                        label="Plans Address"
                        value={testData.plans?.address}
                      />
                      <DetailItem
                        label="Conforms to Accepted Plans?"
                        value={formatBoolean(
                          testData.plans?.installationConformsToAcceptedPlans
                        )}
                      />
                      <DetailItem
                        label="Equipment Approved?"
                        value={formatBoolean(
                          testData.plans?.equipmentUsedIsApproved
                        )}
                      />
                      <DetailItem
                        label="Deviations Explanation"
                        value={testData.plans?.deviationsExplanation}
                        className="col-span-full"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md mb-2">Instructions</h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DetailItem
                        label="Person in Charge Instructed?"
                        value={formatBoolean(
                          testData.instructions?.personInChargeInstructed
                        )}
                      />
                      <DetailItem
                        label="Instruction Explanation"
                        value={testData.instructions?.instructionExplanation}
                      />
                      <DetailItem
                        label="Care Charts Left?"
                        value={formatBoolean(
                          testData.instructions?.instructionsAndCareChartsLeft
                        )}
                      />
                      <DetailItem
                        label="Charts Explanation"
                        value={testData.instructions?.chartsExplanation}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Pipes, Joints & Flushing */}
              <AccordionItem value="item-3">
                <AccordionTrigger>Pipes, Joints & Flushing</AccordionTrigger>
                <AccordionContent className="space-y-6 p-2">
                  <div>
                    <h4 className="font-semibold text-md mb-2">Supplies</h4>
                    <DetailItem
                      label="Location of Systems"
                      value={testData.suppliesBuildingsNames?.join(", ")}
                    />
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md mb-2">
                      Pipes & Joints
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      <DetailItem
                        label="Pipe Type & Class"
                        value={
                          testData.undergroundPipesAndJoints?.pipeTypesAndClass
                        }
                      />
                      <DetailItem
                        label="Joint Type"
                        value={testData.undergroundPipesAndJoints?.typeJoint}
                      />
                      <DetailItem
                        label="Pipe Standard"
                        value={testData.undergroundPipesAndJoints?.pipeStandard}
                      />
                      <DetailItem
                        label="Conforms to Pipe Standard?"
                        value={formatBoolean(
                          testData.undergroundPipesAndJoints
                            ?.pipeStandardConform
                        )}
                      />
                      <DetailItem
                        label="Fitting Standard"
                        value={
                          testData.undergroundPipesAndJoints?.fittingStandard
                        }
                      />
                      <DetailItem
                        label="Conforms to Fitting Standard?"
                        value={formatBoolean(
                          testData.undergroundPipesAndJoints
                            ?.fittingStandardConform
                        )}
                      />
                      <DetailItem
                        label="Fitting Explanation"
                        value={
                          testData.undergroundPipesAndJoints
                            ?.fittingStandardExplanation
                        }
                        className="col-span-full"
                      />
                      <DetailItem
                        label="Joints Standard"
                        value={
                          testData.undergroundPipesAndJoints?.jointsStandard
                        }
                      />
                      <DetailItem
                        label="Conforms to Joints Standard?"
                        value={formatBoolean(
                          testData.undergroundPipesAndJoints
                            ?.jointsStandardConform
                        )}
                      />
                      <DetailItem
                        label="Joints Explanation"
                        value={
                          testData.undergroundPipesAndJoints
                            ?.jointsStandardExplanation
                        }
                        className="col-span-full"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md mb-2">
                      Main Piping Flushing Test
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DetailItem
                        label="Piping Standard"
                        value={
                          testData.flushingTests?.undergroundPipingStandard
                        }
                      />
                      <DetailItem
                        label="Conforms to Piping Standard?"
                        value={formatBoolean(
                          testData.flushingTests
                            ?.undergroundPipingStandardConform
                        )}
                      />
                      <DetailItem
                        label="Piping Explanation"
                        value={
                          testData.flushingTests
                            ?.undergroundPipingStandardExplanation
                        }
                        className="col-span-full"
                      />
                      <DetailItem
                        label="Flow Obtained From"
                        value={testData.flushingTests?.flushingFlowObtained}
                      />
                      <DetailItem
                        label="Opening Type"
                        value={testData.flushingTests?.openingType}
                      />
                    </div>
                  </div>
                  {/* --- NEWLY ADDED SECTION --- */}
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md mb-2">
                      Lead-in Connection Flushing Tests
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DetailItem
                        label="Piping Standard"
                        value={
                          testData.leadsflushingTests?.undergroundPipingStandard
                        }
                      />
                      <DetailItem
                        label="Conforms to Piping Standard?"
                        value={formatBoolean(
                          testData.leadsflushingTests
                            ?.undergroundPipingStandardConform
                        )}
                      />
                      <DetailItem
                        label="Piping Explanation"
                        value={
                          testData.leadsflushingTests
                            ?.undergroundPipingStandardExplanation
                        }
                        className="col-span-full"
                      />
                      <DetailItem
                        label="Flow Obtained From"
                        value={
                          testData.leadsflushingTests?.flushingFlowObtained
                        }
                      />
                      <DetailItem
                        label="Opening Type"
                        value={testData.leadsflushingTests?.openingType}
                      />
                    </div>
                  </div>
                  {/* --- END OF NEWLY ADDED SECTION --- */}
                </AccordionContent>
              </AccordionItem>

              {/* Tests */}
              <AccordionItem value="item-4">
                <AccordionTrigger>Hydrostatic & Leakage Tests</AccordionTrigger>
                <AccordionContent className="space-y-6 p-2">
                  <div>
                    <h4 className="font-semibold text-md mb-2">
                      Hydrostatic Test
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <DetailItem
                        label="Tested At (PSI)"
                        value={testData.hydrostaticTest?.testedAtPSI}
                      />
                      <DetailItem
                        label="Tested For (Hours)"
                        value={testData.hydrostaticTest?.testedHours}
                      />
                      <DetailItem
                        label="Joints Covered During Test?"
                        value={formatBoolean(
                          testData.hydrostaticTest?.jointsCovered
                        )}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-md mb-2">Leakage Test</h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DetailItem
                        label="Leakage (Gallons/Hours)"
                        value={`${
                          testData.leakageTest?.leakeageGallons ?? "--"
                        } gal / ${
                          testData.leakageTest?.leakageHours ?? "--"
                        } hrs`}
                      />
                      <DetailItem
                        label="Allowable Leakage (Gallons/Hours)"
                        value={`${
                          testData.leakageTest?.allowableLeakageGallons ?? "--"
                        } gal / ${
                          testData.leakageTest?.allowableLeakageHours ?? "--"
                        } hrs`}
                      />
                      <DetailItem
                        label="Forward Flow Test Performed?"
                        value={formatBoolean(
                          testData.leakageTest?.forwardFlowTestPerformed
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Hydrants & Valves */}
              <AccordionItem value="item-5">
                <AccordionTrigger>Hydrants & Control Valves</AccordionTrigger>
                <AccordionContent className="grid gap-6 sm:grid-cols-2 p-2">
                  <DetailItem
                    label="Number of Hydrants"
                    value={testData.hydrantsAndControlValves?.numberOfHydrants}
                  />
                  <DetailItem
                    label="Hydrant Make & Type"
                    value={
                      testData.hydrantsAndControlValves?.hydrantMakeAndType
                    }
                  />
                  <DetailItem
                    label="All Operate Satisfactorily?"
                    value={formatBoolean(
                      testData.hydrantsAndControlValves
                        ?.allOperateSatisfactorily
                    )}
                  />
                  <DetailItem
                    label="Control Valves Left Wide Open?"
                    value={formatBoolean(
                      testData.hydrantsAndControlValves
                        ?.waterControlValvesLeftWideOpen
                    )}
                  />
                  <DetailItem
                    label="Hose Threads Interchangeable?"
                    value={formatBoolean(
                      testData.hydrantsAndControlValves
                        ?.hoseThreadsInterchangeable
                    )}
                  />
                  <DetailItem
                    label="Valves Not Open Explanation"
                    value={
                      testData.hydrantsAndControlValves
                        ?.valvesNotOpenExplanation
                    }
                    className="col-span-full"
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Remarks & Signatures */}
              <AccordionItem value="item-6">
                <AccordionTrigger>Remarks</AccordionTrigger>
                <AccordionContent className="p-2 grid sm:grid-cols-2 gap-6">
                  <DetailItem
                    label="Date Left in Service"
                    value={formatDate(testData.remarks?.dateLeftInService)}
                  />
                  <DetailItem
                    label="Name of Installing Contractor"
                    value={testData.remarks?.nameOfInstallingContractor}
                  />
                </AccordionContent>
              </AccordionItem>
              {/* Signatures */}
              <AccordionItem value="item-8">
                <AccordionTrigger>Signatures</AccordionTrigger>
                <AccordionContent className="p-2 grid sm:grid-cols-2 gap-x-6 gap-y-8">
                  {/* Property Owner Signature Details */}
                  <div>
                    <h4 className="font-semibold text-md mb-2">
                      For Property Owner
                    </h4>
                    <div className="space-y-4">
                      <DetailItem
                        label="Title"
                        value={testData.signatures?.forPropertyOwner?.title}
                      />
                      <DetailItem
                        label="Date Signed"
                        value={formatDate(
                          testData.signatures?.forPropertyOwner?.date
                        )}
                      />
                    </div>
                  </div>

                  {/* Installing Contractor Signature Details */}
                  <div>
                    <h4 className="font-semibold text-md mb-2">
                      For Installing Contractor
                    </h4>
                    <div className="space-y-4">
                      <DetailItem
                        label="Title"
                        value={
                          testData.signatures?.forInstallingContractor?.title
                        }
                      />
                      <DetailItem
                        label="Date Signed"
                        value={formatDate(
                          testData.signatures?.forInstallingContractor?.date
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* Additional Notes */}
              <AccordionItem value="item-7">
                <AccordionTrigger>Additional Notes</AccordionTrigger>
                <AccordionContent className="p-2">
                  <DetailItem value={testData.additionalNotes} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-gray-500 space-y-1 pt-6">
            <p>
              Created On: {formatDate(testData.createdAt)} by{" "}
              {testData.createdBy?.username || "--"}
            </p>
            <p>Last Updated: {formatDate(testData.updatedAt)}</p>
            <p className="pt-2">Test ID: {testData._id}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
