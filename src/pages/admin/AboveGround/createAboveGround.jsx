import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import {
  useCreateAboveGroundTestMutation,
  useUpdateAboveGroundTestMutation,
  useGetAboveGroundTestByIdQuery,
} from "@/store/GlobalApi";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { PropertyDetailsSection } from "./formComponents/PropertyDetailsSection";
import { PlansAndInstructionsSection } from "./formComponents/PlansAndInstructionsSection";
import { SystemComponentsSection } from "./formComponents/SystemComponentsSection";
import { AlarmsAndValvesSection } from "./formComponents/AlarmsAndValvesSection";
import { TestingSection } from "./formComponents/Testing";
import { WeldingAndCutoutsSection } from "./formComponents/WeldingAndCutoutsSection";
import { FinalChecksSection } from "./formComponents/FinalChecksSection";
import { RemarksAndSignaturesSection } from "./formComponents/Remarks";
import { NotesSection } from "./formComponents/Notes";

 const nameRegex = /^[a-zA-Z\s\.\-]+$/;

// For Addresses: Allows letters, numbers, spaces, dots, commas, and hyphens.
const addressRegex = /^[a-zA-Z0-9\s\.\,\-]+$/;

// For Models/Makes/Types/Serials: Allows letters, numbers, hyphens, and underscores.
const modelSerialRegex = /^[a-zA-Z0-9 \-\_]+$/;

// For General Text/Explanations: Allows more punctuation but prevents most other special characters.
const generalTextRegex = /^[a-zA-Z0-9\s\.\,\-\_()]+$/;

// --- Helper for Optional String Validation ---
// A function to create a Zod refinement for optional fields, preventing validation on empty strings.
const optionalWithRegex = (regex, message) =>
  z.string().optional().default("").refine(val => val === "" || regex.test(val), { message });

// --- Sub-Schemas with Validation ---

 const signatureSchema = z.object({
  name: optionalWithRegex(nameRegex, "Name can only contain letters, spaces, dots, and hyphens."),
  title: optionalWithRegex(nameRegex, "Title can only contain letters, spaces, dots, and hyphens."),
  date: z.coerce.date().optional().nullable(),
});

const sprinklerSchema = z.object({
  make: optionalWithRegex(modelSerialRegex, "Make contains invalid characters."),
  model: optionalWithRegex(modelSerialRegex, "Model contains invalid characters."),
  yearOfMfg: z.coerce.number().optional().nullable(),
  orificeSize: optionalWithRegex(modelSerialRegex, "Orifice Size contains invalid characters."),
  quantity: z.coerce.number().positive("Quantity must be positive.").optional().nullable(),
  tempRating: optionalWithRegex(modelSerialRegex, "Temp Rating contains invalid characters."),
});

const alarmDeviceSchema = z.object({
  type: optionalWithRegex(modelSerialRegex, "Type contains invalid characters."),
  make: optionalWithRegex(modelSerialRegex, "Make contains invalid characters."),
  model: optionalWithRegex(modelSerialRegex, "Model contains invalid characters."),
  maxOperationTime: z.object({
    min: z.coerce.number().optional().nullable(),
    sec: z.coerce.number().optional().nullable(),
  }).optional(),
});

const dryPipeOperatingTestSchema = z.object({
  dryValve: z.object({
    make: optionalWithRegex(modelSerialRegex, "Make contains invalid characters."),
    model: optionalWithRegex(modelSerialRegex, "Model contains invalid characters."),
    serialNumber: optionalWithRegex(modelSerialRegex, "Serial Number contains invalid characters."),
  }).optional(),
  qodValve: z.object({
    make: optionalWithRegex(modelSerialRegex, "Make contains invalid characters."),
    model: optionalWithRegex(modelSerialRegex, "Model contains invalid characters."),
    serialNumber: optionalWithRegex(modelSerialRegex, "Serial Number contains invalid characters."),
  }).optional(),
  timeToTripWithoutQOD: z.object({ min: z.coerce.number().optional().nullable(), sec: z.coerce.number().optional().nullable() }).optional(),
  timeToTripWithQOD: z.object({ min: z.coerce.number().optional().nullable(), sec: z.coerce.number().optional().nullable() }).optional(),
  waterPressureWithoutQOD: z.coerce.number().optional().nullable(),
  waterPressureWithQOD: z.coerce.number().optional().nullable(),
  airPressureWithoutQOD: z.coerce.number().optional().nullable(),
  airPressureWithQOD: z.coerce.number().optional().nullable(),
  tripPointAirPressureWithoutQOD: z.coerce.number().optional().nullable(),
  tripPointAirPressureWithQOD: z.coerce.number().optional().nullable(),
  timeWaterReachedOutletWithoutQOD: z.object({ min: z.coerce.number().optional().nullable(), sec: z.coerce.number().optional().nullable() }).optional(),
  timeWaterReachedOutletWithQOD: z.object({ min: z.coerce.number().optional().nullable(), sec: z.coerce.number().optional().nullable() }).optional(),
  alarmOperatedProperlyWithoutQOD: z.boolean().optional().default(true),
  alarmOperatedProperlyWithQOD: z.boolean().optional().default(true),
  explain: optionalWithRegex(generalTextRegex, "Explanation contains invalid characters."),
});

const delugePreActionValveSchema = z.object({
  operation: z.enum(["pneumatic", "electric", "hydraulic"]).nullable().optional(),
  isPipingSupervised: z.boolean().optional().default(false),
  isDetectingMediaSupervised: z.boolean().optional().default(false),
  operatesFromManualOrRemote: z.boolean().optional().default(true),
  isAccessibleForTesting: z.boolean().optional().default(true),
  explanation: optionalWithRegex(generalTextRegex, "Explanation contains invalid characters."),
  make: optionalWithRegex(modelSerialRegex, "Make contains invalid characters."),
  model: optionalWithRegex(modelSerialRegex, "Model contains invalid characters."),
  doesSupervisionLossAlarmOperate: z.boolean().optional().default(true),
  doesValveReleaseOperate: z.boolean().optional().default(true),
  maxTimeToOperateRelease: z.object({ min: z.coerce.number().optional().nullable(), sec: z.coerce.number().optional().nullable() }).optional(),
});

const pressureReducingValveTestSchema = z.object({
  locationAndFloor: optionalWithRegex(addressRegex, "Location contains invalid characters."),
  makeAndModel: optionalWithRegex(modelSerialRegex, "Make and Model contains invalid characters."),
  setting: optionalWithRegex(generalTextRegex, "Setting contains invalid characters."),
  staticPressure: z.object({ inlet: z.coerce.number().optional().nullable(), outlet: z.coerce.number().optional().nullable() }).optional(),
  residualPressure: z.object({ inlet: z.coerce.number().optional().nullable(), outlet: z.coerce.number().optional().nullable() }).optional(),
  flowRate: z.coerce.number().optional().nullable(),
});


// --- Main Form Schema ---

 const formSchema = z.object({
  propertyDetails: z.object({
    propertyName: z.string().min(1, "Property name is required.").regex(nameRegex, "Property Name can only contain letters, spaces, dots, and hyphens."),
    date: z.coerce.date().max(new Date(), { message: "Date cannot be in the future." }),
    propertyAddress: optionalWithRegex(addressRegex, "Property Address contains invalid characters."),
    isNewInstallation: z.boolean().default(false),
    isModification: z.boolean().default(false),
  }),
  plansAndInstructions: z.object({
    plans: z.object({
      acceptedByAuthorities: z.array(z.string()).optional().default([]),
      address: optionalWithRegex(addressRegex, "Address contains invalid characters."),
      conformsToAcceptedPlans: z.boolean().optional().default(true),
      equipmentIsApproved: z.boolean().optional().default(true),
      deviationsExplanation: optionalWithRegex(generalTextRegex, "Explanation contains invalid characters."),
    }).optional(),
    instructions: z.object({
      isPersonInChargeInstructed: z.boolean().optional().default(true),
      instructionExplanation: optionalWithRegex(generalTextRegex, "Explanation contains invalid characters."),
      hasSystemComponentsInstructions: z.boolean().optional().default(true),
      hasCareAndMaintenanceInstructions: z.boolean().optional().default(true),
      hasNFPA25: z.boolean().optional().default(true),
    }).optional(),
  }),
  systemComponents: z.object({
    sprinklers: z.array(sprinklerSchema).optional(),
    pipeAndFittings: z.object({
      pipeType: optionalWithRegex(modelSerialRegex, "Pipe Type contains invalid characters."),
      fittingsType: optionalWithRegex(modelSerialRegex, "Fittings Type contains invalid characters."),
    }).optional(),
  }),
  alarmsAndValves: z.object({
    alarmValvesOrFlowIndicators: z.array(alarmDeviceSchema).optional(),
    dryPipeOperatingTests: z.array(dryPipeOperatingTestSchema).optional(),
    delugeAndPreActionValves: z.array(delugePreActionValveSchema).optional(),
    pressureReducingValveTests: z.array(pressureReducingValveTestSchema).optional(),
  }),
  testing: z.object({
    backflowTest: z.object({
      meansUsed: optionalWithRegex(generalTextRegex, "Means Used contains invalid characters."),
      wasFlowDemandCreated: z.enum(["Yes", "No", "N/A"]).nullable().optional(),
    }).optional(),
    hydrostaticTest: z.object({
      pressurePsi: z.coerce.number().optional().nullable(),
      pressureBar: z.coerce.number().optional().nullable(),
      durationHrs: z.coerce.number().optional().nullable(),
    }).optional(),
    isDryPipingPneumaticallyTested: z.boolean().optional().default(false),
    doesEquipmentOperateProperly: z.boolean().optional().default(true),
    improperOperationReason: optionalWithRegex(generalTextRegex, "Reason contains invalid characters."),
    noCorrosiveChemicalsCertification: z.boolean().optional().default(true),
    drainTest: z.object({
      gaugeReadingPsi: z.coerce.number().optional().nullable(),
      gaugeReadingBar: z.coerce.number().optional().nullable(),
      residualPressurePsi: z.coerce.number().optional().nullable(),
      residualPressureBar: z.coerce.number().optional().nullable(),
    }).optional(),
    undergroundPiping: z.object({
      isVerifiedByCertificate: z.boolean().optional().default(true),
      wasFlushedByInstaller: z.boolean().optional().default(true),
      explanation: optionalWithRegex(generalTextRegex, "Explanation contains invalid characters."),
    }).optional(),
    powderDrivenFasteners: z.object({
      isTestingSatisfactory: z.boolean().optional().default(true),
      explanation: optionalWithRegex(generalTextRegex, "Explanation contains invalid characters."),
    }).optional(),
    blankTestingGaskets: z.object({
      numberUsed: z.coerce.number().optional().nullable(),
      locations: optionalWithRegex(generalTextRegex, "Locations text contains invalid characters."),
      numberRemoved: z.coerce.number().optional().nullable(),
    }).optional(),
  }),
  weldingAndCutouts: z.object({
    isWeldingPiping: z.boolean().optional().default(false),
    certifications: z.object({
      awsB21Compliant: z.boolean().optional().default(true),
      weldersQualified: z.boolean().optional().default(true),
      qualityControlProcedureCompliant: z.boolean().optional().default(true),
    }).optional(),
    cutouts: z.object({ hasRetrievalControl: z.boolean().optional().default(true) }).optional(),
  }).optional(),
  finalChecks: z.object({
    hasHydraulicDataNameplate: z.boolean().optional().default(true),
    nameplateExplanation: optionalWithRegex(generalTextRegex, "Explanation contains invalid characters."),
    areCapsAndStrapsRemoved: z.boolean().optional().default(true),
  }),
  remarksAndSignatures: z.object({
    remarks: optionalWithRegex(generalTextRegex, "Remarks contains invalid characters."),
    dateLeftInService: z.coerce.date().max(new Date(), { message: "Date cannot be in the future." }).optional().nullable(),
    sprinklerContractorName: optionalWithRegex(nameRegex, "Contractor Name can only contain letters, spaces, dots, and hyphens."),
    fireMarshalOrAHJ: signatureSchema.optional(),
    sprinklerContractor: signatureSchema.optional(),
  }).optional(),
  notes: optionalWithRegex(generalTextRegex, "Notes contains invalid characters."),
});

export default function AboveGroundTestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdateMode = !!id;

  const [createTest, { isLoading: isCreating }] =
    useCreateAboveGroundTestMutation();
  const [updateTest, { isLoading: isUpdating }] =
    useUpdateAboveGroundTestMutation();
  const { data: existingData, isLoading: isFetching } =
    useGetAboveGroundTestByIdQuery(id, { skip: !isUpdateMode });
  console.log("🚀 ~ AboveGroundTestForm ~ existingData:", existingData);

  const isLoading = isCreating || isUpdating;

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyDetails: {
        propertyName: "",
        date: formatDateForInput(new Date().toISOString()),
        propertyAddress: "",
        isNewInstallation: false,
        isModification: false,
      },
      plansAndInstructions: { plans: {}, instructions: {} },
      systemComponents: { sprinklers: [], pipeAndFittings: {} },
      alarmsAndValves: {
        alarmValvesOrFlowIndicators: [],
        dryPipeOperatingTests: [],
        delugeAndPreActionValves: [],
        pressureReducingValveTests: [],
      },
      testing: {
        hydrostaticTest: {},
        drainTest: {},
        undergroundPiping: {},
        powderDrivenFasteners: {},
        blankTestingGaskets: {},
      },
      weldingAndCutouts: { certifications: {}, cutouts: {} },
      finalChecks: {},
      remarksAndSignatures: {
        dateLeftInService: formatDateForInput(new Date().toISOString()),
        fireMarshalOrAHJ: {},
        sprinklerContractor: {},
      },
      notes: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (isUpdateMode && existingData) {
      const testData = existingData.data?.aboveGroundTest;

      if (testData) {
        const dataForReset = {
          ...testData,

          propertyDetails: {
            ...testData.propertyDetails,
            date: formatDateForInput(testData.propertyDetails?.date),
          },
          remarksAndSignatures: {
            ...testData.remarksAndSignatures,
            dateLeftInService: formatDateForInput(
              testData.remarksAndSignatures?.dateLeftInService
            ),
            fireMarshalOrAHJ: {
              ...testData.remarksAndSignatures?.fireMarshalOrAHJ,
              date: formatDateForInput(
                testData.remarksAndSignatures?.fireMarshalOrAHJ?.date
              ),
            },
            sprinklerContractor: {
              ...testData.remarksAndSignatures?.sprinklerContractor,
              date: formatDateForInput(
                testData.remarksAndSignatures?.sprinklerContractor?.date
              ),
            },
          },
        };

        console.log("🚀 ~ Corrected data being passed to reset:", dataForReset);
        reset(dataForReset);
      }
    }
  }, [existingData, isUpdateMode, reset]);

  async function onSubmit(values) {
    console.log("Form Values Submitted:", values);
    const promise = () =>
      isUpdateMode
        ? updateTest({ id, ...values }).unwrap()
        : createTest(values).unwrap();
    toast.promise(promise, {
      loading: "Saving record...",
      success: (res) => {
        navigate("/above-ground");
        return `Record saved successfully.`;
      },
      error: (err) => {
        console.error("API Error:", err);
        return `Failed to save record.`;
      },
    });
  }

  if (isFetching) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 -mt-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isUpdateMode ? "Update Test Record" : "Create New Test Record"}
            </h1>
            <p className="text-muted-foreground">
              A complete report based on NFPA standards.
            </p>
          </div>
        </div>
        <Button type="submit" form="above-ground-form" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdateMode ? "Save Changes" : "Create Record"}
        </Button>
      </div>

      <Form {...form}>
        <form id="above-ground-form" onSubmit={form.handleSubmit(onSubmit)}>
          <Accordion
            type="multiple"
            defaultValue={["item-1"]}
            className="w-full space-y-4"
          >
            <PropertyDetailsSection control={form.control} />
            <PlansAndInstructionsSection
              control={form.control}
              watch={form.watch}
            />
            <SystemComponentsSection control={form.control} />
            <AlarmsAndValvesSection control={form.control} />
            <TestingSection control={form.control} />
            <WeldingAndCutoutsSection
              control={form.control}
              watch={form.watch}
            />

            <FinalChecksSection control={form.control} />
            <RemarksAndSignaturesSection
              control={form.control}
              watch={form.watch}
            />
            <NotesSection control={form.control} />
           
          </Accordion>
        </form>
      </Form>
    </div>
  );
}
