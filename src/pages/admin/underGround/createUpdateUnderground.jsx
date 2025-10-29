import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import {
  useCreateUndergroundTestMutation,
  useUpdateUndergroundTestMutation,
  useGetUndergroundTestByIdQuery,
} from "@/store/GlobalApi";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PropertyDetailsSection } from "./formComponents/propertyDetail";
import { PlansAndInstructionsSection } from "./formComponents/plan";
import { PipesAndJointsSection } from "./formComponents/undergroundPipesAndJoints";
import { FlushingTests } from "./formComponents/flushingTests";
import { HydrostaticTest } from "./formComponents/hydrostaticTest";
import { LeakageTest } from "./formComponents/leakageTest";
import { HydrantsAndValves } from "./formComponents/hydrantsAndControlValves";
import { RemarksAndSignatures } from "./formComponents/remarksAndSignatures";
import { LeadsFlushingTests } from "./formComponents/leadsFlushing";

const noSpecialChars = z.string().regex(/^[a-zA-Z0-9\s.,'&#-()/]*$/, {
  message: "Field contains invalid characters.",
});

const signatureSchema = z.object({
  // Applied validation to signature fields
  signed: noSpecialChars.optional().default(""),
  title: noSpecialChars.optional().default(""),
  date: z.string().optional().default(""), // Date fields are kept as plain strings
});

const REALISTIC_MAX_VALUE = 100000;

const formSchema = z.object({
  propertyDetails: z.object({
    propertyName: noSpecialChars.min(1, "Property name is required."),
    date: z.string().optional().default(""),
    propertyAddress: noSpecialChars.min(1, "Property address is required."),
  }),

  plans: z.object({
    acceptedByApprovingAuthorities: z.array(noSpecialChars).optional().default([]),
    address: noSpecialChars.optional().default(""),
    installationConformsToAcceptedPlans: z.boolean().optional().default(true),
    equipmentUsedIsApproved: z.boolean().optional().default(true),
    deviationsExplanation: noSpecialChars.optional().default(""),
  }),

  instructions: z.object({
    personInChargeInstructed: z.boolean().optional().default(true),
    instructionExplanation: noSpecialChars.optional().default(""),
    instructionsAndCareChartsLeft: z.boolean().optional().default(true),
    chartsExplanation: noSpecialChars.optional().default(""),
  }),

  suppliesBuildingsNames: z.array(noSpecialChars).optional().default([]),

  undergroundPipesAndJoints: z.object({
    pipeTypesAndClass: noSpecialChars.optional().default(""),
    typeJoint: noSpecialChars.optional().default(""),
    pipeStandard: noSpecialChars.optional().default(""),
    pipeStandardConform: z.boolean().optional().default(true),
    fittingStandard: noSpecialChars.optional().default(""),
    fittingStandardConform: z.boolean().optional().default(true),
    fittingStandardExplanation: noSpecialChars.optional().default(""),
    jointsStandard: noSpecialChars.optional().default(""),
    jointsStandardConform: z.boolean().optional().default(true),
    jointsStandardExplanation: noSpecialChars.optional().default(""),
  }),

  flushingTests: z.object({
    undergroundPipingStandard: noSpecialChars.optional().default(""),
    undergroundPipingStandardConform: z.boolean().optional().default(true),
    undergroundPipingStandardExplanation: noSpecialChars.optional().default(""),
    flushingFlowObtained: z
      .enum(["Public water", "Tank or reservoir", "Fire pump"])
      .nullable()
      .optional(),
    openingType: z.enum(["Hydrant butt", "Open pipe"]).nullable().optional(),
  }),

  leadsflushingTests: z.object({
    undergroundPipingStandard: noSpecialChars.optional().default(""),
    undergroundPipingStandardConform: z.boolean().optional().default(true),
    undergroundPipingStandardExplanation: noSpecialChars.optional().default(""),
    flushingFlowObtained: z
      .enum(["Public water", "Tank or reservoir", "Fire pump"])
      .nullable()
      .optional(),
    openingType: z
      .enum(["Y connection to flange and spigot", "Open pipe"])
      .nullable()
      .optional(),
  }),

  hydrostaticTest: z.object({
    testedAtPSI: z.coerce
      .number({
        required_error: "Test At (PSI) is required.",
        invalid_type_error: "Test At (PSI) must be a number.",
      })
      .int({ message: "PSI must be a whole number." })
      .nonnegative({ message: "PSI cannot be a negative number." })
      .max(REALISTIC_MAX_VALUE, { message: "PSI value is unrealistically high." })
      .optional(),

    testedHours: z.coerce
      .number({
        required_error: "Tested For (Hours) is required.",
        invalid_type_error: "Tested For (Hours) must be a number.",
      })
      .int({ message: "Hours must be a whole number." })
      .nonnegative({ message: "Hours cannot be a negative number." })
      .max(REALISTIC_MAX_VALUE, { message: "Hours value is unrealistically high." })
      .optional(),

    jointsCovered: z.boolean().optional().default(false),
  }),

  leakageTest: z.object({
    leakeageGallons: z.coerce
      .number({
        required_error: "Leakage Gallons is required.",
        invalid_type_error: "Leakage Gallons must be a number.",
      })
      .int({ message: "Gallons must be a whole number." })
      .nonnegative({ message: "Gallons cannot be a negative number." })
      .max(REALISTIC_MAX_VALUE, { message: "Gallons value is unrealistically high." })
      .optional(),

    leakageHours: z.coerce
      .number({
        required_error: "Leakage Hours is required.",
        invalid_type_error: "Leakage Hours must be a number.",
      })
      .int({ message: "Hours must be a whole number." })
      .nonnegative({ message: "Hours cannot be a negative number." })
      .max(REALISTIC_MAX_VALUE, { message: "Hours value is unrealistically high." })
      .optional(),
      
    allowableLeakageGallons: z.coerce.number().nonnegative().optional(),
    allowableLeakageHours: z.coerce.number().nonnegative().optional(),
    forwardFlowTestPerformed: z.boolean().optional().default(false),
  }),

  hydrantsAndControlValves: z.object({
    numberOfHydrants: z.coerce.number().min(0).optional(),
    hydrantMakeAndType: noSpecialChars.optional().default(""),
    allOperateSatisfactorily: z.boolean().optional().default(true),
    waterControlValvesLeftWideOpen: z.boolean().optional().default(true),
    valvesNotOpenExplanation: noSpecialChars.optional().default(""),
    hoseThreadsInterchangeable: z.boolean().optional().default(true),
  }),

  remarks: z.object({
    dateLeftInService: z.string().optional().default(""),
    nameOfInstallingContractor: noSpecialChars.optional().default(""),
  }),

  signatures: z.object({
    forPropertyOwner: signatureSchema.optional(),
    forInstallingContractor: signatureSchema.optional(),
  }),

  additionalNotes: noSpecialChars.optional().default(""),
});

export default function UndergroundTestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdateMode = !!id;

  const [createTest, { isLoading: isCreating }] =
    useCreateUndergroundTestMutation();
  const [updateTest, { isLoading: isUpdating }] =
    useUpdateUndergroundTestMutation();
  const { data: existingData, isLoading: isFetching } =
    useGetUndergroundTestByIdQuery(id, { skip: !isUpdateMode });

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
      },
      plans: {},
      instructions: {},
      suppliesBuildingsNames: [],
      undergroundPipesAndJoints: {},
      flushingTests: {},
      leadsflushingTests: {},

      hydrostaticTest: {},
      leakageTest: {},
      hydrantsAndControlValves: {},
      remarks: {
        dateLeftInService: formatDateForInput(new Date().toISOString()),
        nameOfInstallingContractor: "",
      },
      signatures: {
        forPropertyOwner: {},
        forInstallingContractor: {},
      },
      additionalNotes: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (isUpdateMode && existingData) {
      const testData = existingData.data?.undergroundTest;

      if (testData) {
        const dataForReset = {
          ...testData,
          propertyDetails: {
            ...testData.propertyDetails,
            date: formatDateForInput(testData.propertyDetails?.date),
          },
          remarks: {
            ...testData.remarks,
            dateLeftInService: formatDateForInput(
              testData.remarks?.dateLeftInService
            ),
          },
          signatures: {
            forPropertyOwner: {
              ...testData.signatures?.forPropertyOwner,
              date: formatDateForInput(
                testData.signatures?.forPropertyOwner?.date
              ),
            },
            forInstallingContractor: {
              ...testData.signatures?.forInstallingContractor,
              date: formatDateForInput(
                testData.signatures?.forInstallingContractor?.date
              ),
            },
          },
        };
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
        navigate("/under-ground");
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
              {isUpdateMode
                ? "Update Underground Test"
                : "Create Underground Test"}
            </h1>
            <p className="text-muted-foreground">
              Contractor's material and test certificate for underground piping.
            </p>
          </div>
        </div>
        <Button type="submit" form="under-ground-form" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdateMode ? "Save Changes" : "Create Record"}
        </Button>
      </div>

      <Form {...form}>
        <form id="under-ground-form" onSubmit={form.handleSubmit(onSubmit)}>
          <Accordion
            type="multiple"
            defaultValue={["item-1"]}
            className="w-full space-y-4"
          >
            <PropertyDetailsSection control={form.control} />
            <PlansAndInstructionsSection control={form.control} />
            <PipesAndJointsSection control={form.control} />
            <FlushingTests control={form.control} />
            <LeadsFlushingTests control={form.control} />
            <HydrostaticTest control={form.control} />
            <LeakageTest control={form.control} />
            <HydrantsAndValves control={form.control} />
            <RemarksAndSignatures control={form.control} />
          </Accordion>
        </form>
      </Form>
    </div>
  );
}
