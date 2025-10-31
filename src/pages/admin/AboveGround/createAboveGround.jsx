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

 const signatureSchema = z.object({
  name: z
    .string()
    .optional()
    .default("")
    .regex(/^[a-zA-Z0-9]*$/, "Name can only contain letters and numbers.") // Stricter: no spaces, no special chars
    .transform((val) => val.trim()),
  title: z
    .string()
    .optional()
    .default("")
    .regex(/^[a-zA-Z0-9]*$/, "Title can only contain letters and numbers.") // Stricter: no spaces, no special chars
    .transform((val) => val.trim()),
  date: z.string().optional().default(""), // This date field has no future date restriction
});

const sprinklerSchema = z.object({
  make: z.string().optional().default(""),
  model: z.string().optional().default(""),
  yearOfMfg: z.coerce.number().optional(),
  orificeSize: z.string().optional().default(""),
  quantity: z.coerce.number().optional(),
  tempRating: z.string().optional().default(""),
});

const alarmDeviceSchema = z.object({
  type: z.string().optional().default(""),
  make: z.string().optional().default(""),
  model: z.string().optional().default(""),
  maxOperationTime: z
    .object({
      min: z.coerce.number().optional(),
      sec: z.coerce.number().optional(),
    })
    .optional(),
});

const dryPipeOperatingTestSchema = z.object({
  dryValve: z
    .object({
      make: z.string().optional().default(""),
      model: z.string().optional().default(""),
      serialNumber: z.string().optional().default(""),
    })
    .optional(),
  qodValve: z
    .object({
      make: z.string().optional().default(""),
      model: z.string().optional().default(""),
      serialNumber: z.string().optional().default(""),
    })
    .optional(),
  timeToTripWithoutQOD: z
    .object({
      min: z.coerce.number().optional(),
      sec: z.coerce.number().optional(),
    })
    .optional(),
  timeToTripWithQOD: z
    .object({
      min: z.coerce.number().optional(),
      sec: z.coerce.number().optional(),
    })
    .optional(),
  waterPressureWithoutQOD: z.coerce.number().optional(),
  waterPressureWithQOD: z.coerce.number().optional(),
  airPressureWithoutQOD: z.coerce.number().optional(),
  airPressureWithQOD: z.coerce.number().optional(),
  tripPointAirPressureWithoutQOD: z.coerce.number().optional(),
  tripPointAirPressureWithQOD: z.coerce.number().optional(),
  timeWaterReachedOutletWithoutQOD: z
    .object({
      min: z.coerce.number().optional(),
      sec: z.coerce.number().optional(),
    })
    .optional(),
  timeWaterReachedOutletWithQOD: z
    .object({
      min: z.coerce.number().optional(),
      sec: z.coerce.number().optional(),
    })
    .optional(),
  alarmOperatedProperlyWithoutQOD: z.boolean().optional().default(true),
  alarmOperatedProperlyWithQOD: z.boolean().optional().default(true),
  explain: z.string().optional().default(''),
});

const delugePreActionValveSchema = z.object({
  operation: z
    .enum(["pneumatic", "electric", "hydraulic"])
    .nullable()
    .optional(),
  isPipingSupervised: z.boolean().optional().default(false),
  isDetectingMediaSupervised: z.boolean().optional().default(false),
  operatesFromManualOrRemote: z.boolean().optional().default(true),
  isAccessibleForTesting: z.boolean().optional().default(true),
  explanation: z.string().optional().default(""),
  make: z.string().optional().default(""),
  model: z.string().optional().default(""),
  doesSupervisionLossAlarmOperate: z.boolean().optional().default(true),
  doesValveReleaseOperate: z.boolean().optional().default(true),
  maxTimeToOperateRelease: z
    .object({
      min: z.coerce.number().optional(),
      sec: z.coerce.number().optional(),
    })
    .optional(),
});

const pressureReducingValveTestSchema = z.object({
  locationAndFloor: z.string().optional().default(""),
  makeAndModel: z.string().optional().default(""),
  setting: z.string().optional().default(""),
  staticPressure: z
    .object({
      inlet: z.coerce.number().optional(),
      outlet: z.coerce.number().optional(),
    })
    .optional(),
  residualPressure: z
    .object({
      inlet: z.coerce.number().optional(),
      outlet: z.coerce.number().optional(),
    })
    .optional(),
  flowRate: z.coerce.number().optional(),
});

const formSchema = z.object({
  propertyDetails: z.object({
    propertyName: z.string().min(1, "Property name is required."),
    date: z.string().optional().default(""),
    propertyAddress: z.string().optional().default(""),
    isNewInstallation: z.boolean().default(false),
    isModification: z.boolean().default(false),
  }),
  plansAndInstructions: z.object({
    plans: z
      .object({
        acceptedByAuthorities: z.array(z.string()).optional().default([]),
        address: z.string().optional().default(""),
        conformsToAcceptedPlans: z.boolean().optional().default(true),
        equipmentIsApproved: z.boolean().optional().default(true),
        deviationsExplanation: z.string().optional().default(""),
      })
      .optional(),
    instructions: z
      .object({
        isPersonInChargeInstructed: z.boolean().optional().default(true),
        instructionExplanation: z.string().optional().default(""),
        hasSystemComponentsInstructions: z.boolean().optional().default(true),
        hasCareAndMaintenanceInstructions: z.boolean().optional().default(true),
        hasNFPA25: z.boolean().optional().default(true),
      })
      .optional(),
  }),
  systemComponents: z.object({
    sprinklers: z.array(sprinklerSchema).optional(),
    pipeAndFittings: z
      .object({
        pipeType: z.string().optional().default(""),
        fittingsType: z.string().optional().default(""),
      })
      .optional(),
  }),
  alarmsAndValves: z.object({
    alarmValvesOrFlowIndicators: z.array(alarmDeviceSchema).optional(),
    dryPipeOperatingTests: z.array(dryPipeOperatingTestSchema).optional(),
    delugeAndPreActionValves: z.array(delugePreActionValveSchema).optional(),
    pressureReducingValveTests: z
      .array(pressureReducingValveTestSchema)
      .optional(),
  }),
  testing: z.object({
   backflowTest: z
      .object({
        meansUsed: z.string().optional().default(""),
        wasFlowDemandCreated: z.enum(["Yes", "No", "N/A"]).nullable().optional(),
      })
      .optional(),
       hydrostaticTest: z
      .object({
        pressurePsi: z.coerce.number().optional(),
        pressureBar: z.coerce.number().optional(),
        durationHrs: z.coerce.number().optional(),
      })
      .optional(),
    isDryPipingPneumaticallyTested: z.boolean().optional().default(false),
    doesEquipmentOperateProperly: z.boolean().optional().default(true),
    improperOperationReason: z.string().optional().default(""),
    noCorrosiveChemicalsCertification: z.boolean().optional().default(true),
    drainTest: z
      .object({
        gaugeReadingPsi: z.coerce.number().optional(),
        gaugeReadingBar: z.coerce.number().optional(),
        residualPressurePsi: z.coerce.number().optional(),
        residualPressureBar: z.coerce.number().optional(),
      })
      .optional(),
    undergroundPiping: z
      .object({
        isVerifiedByCertificate: z.boolean().optional().default(true),
        wasFlushedByInstaller: z.boolean().optional().default(true),
        explanation: z.string().optional().default(""),
      })
      .optional(),
    powderDrivenFasteners: z
      .object({
        isTestingSatisfactory: z.boolean().optional().default(true),
        explanation: z.string().optional().default(""),
      })
      .optional(),
    blankTestingGaskets: z
      .object({
        numberUsed: z.coerce.number().optional(),
        locations: z.string().optional().default(""),
        numberRemoved: z.coerce.number().optional(),
      })
      .optional(),
  }),
  weldingAndCutouts: z
    .object({
      isWeldingPiping: z.boolean().optional().default(false),
      certifications: z
        .object({
          awsB21Compliant: z.boolean().optional().default(true),
          weldersQualified: z.boolean().optional().default(true),
          qualityControlProcedureCompliant: z
            .boolean()
            .optional()
            .default(true),
        })
        .optional(),
      cutouts: z
        .object({ hasRetrievalControl: z.boolean().optional().default(true) })
        .optional(),
    })
    .optional(),
  finalChecks: z.object({
    hasHydraulicDataNameplate: z.boolean().optional().default(true),
    nameplateExplanation: z.string().optional().default(""),
    areCapsAndStrapsRemoved: z.boolean().optional().default(true),
  }),
  remarksAndSignatures: z
    .object({
      remarks: z.string().optional().default(""),

      // Validation for 'dateLeftInService' - no future dates
      dateLeftInService: z
        .string()
        .optional() // It's optional, but if provided, it must be valid
        .default("") // Default to empty string if not provided
        .refine(
          (dateString) => {
            // Only validate if a non-empty string is provided
            if (dateString === "") return true;

            const selectedDate = new Date(dateString);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today to start of day
            return selectedDate.getTime() <= today.getTime();
          },
          {
            message: "Date cannot be in the future.",
          }
        ),

      // Validation for 'sprinklerContractorName' - no numbers or special characters, but allows spaces
      sprinklerContractorName: z
        .string()
        .optional()
        .default("")
        .regex(
          /^[a-zA-Z\s]*$/, // Allows letters (a-z, A-Z) and spaces only. '*' allows empty string.
          "Sprinkler Contractor Name can only contain letters and spaces."
        )
        .transform((val) => val.trim()), // Trim whitespace for cleaner data

      // These use the existing signatureSchema
      fireMarshalOrAHJ: signatureSchema.optional(),
      sprinklerContractor: signatureSchema.optional(),
    })
    .optional(), // The entire remarksAndSignatures object is optional
  notes: z.string().optional().default(""),
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
