import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import {
  useCreateAlarmMutation,
  useUpdateAlarmMutation,
  useGetAlarmByIdQuery,
} from "@/store/GlobalApi";
import { toast } from "sonner";
import { ArrowLeft, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const nameRegex = /^[a-zA-Z0-9\s\-.'_&]+$/;
const addressRegex = /^[a-zA-Z0-9\s\-.,'#]+$/;
const zipCodeRegex = /^\d{5}(-\d{4})?$/;
const instructionValues = ["VN", "NA", "NC", "ND", "NG"];

const formSchema = z.object({
  accountNumber: z.string().min(3, "Account number is required."),
  communicatorFormat: z.string().min(1, "Communicator format is required."),
  dealerName: z
    .string()
    .min(2, "Dealer name is required.")
    .regex(nameRegex, "Invalid characters."),
  dealerCode: z.string().min(2, "Dealer code is required."),
  startDate: z.coerce.date({
    required_error: "A valid start date is required.",
  }),
  subscriberName: z
    .string()
    .min(2, "Subscriber name is required.")
    .regex(nameRegex, "Invalid characters."),
  installationAddress: z
    .string()
    .min(5, "Address is required.")
    .regex(addressRegex, "Invalid characters."),
  city: z
    .string()
    .min(2, "City is required.")
    .regex(nameRegex, "Invalid characters."),
  state: z
    .string()
    .min(2, "State is required.")
    .regex(nameRegex, "Invalid characters."),
  zip: z.string().regex(zipCodeRegex, "A valid 5-digit ZIP code is required."),
  areas: z
    .array(
      z.object({
        areaNumber: z.coerce
          .number()
          .int()
          .positive("Must be a positive number."),
        zoneNumber: z.coerce
          .number()
          .int()
          .positive("Must be a positive number."),
        zoneDescription: z.string().optional(),
        partitionAreaDescription: z.string().optional(),
        codeDescription: z.string().optional(),
        instruction1: z.enum(instructionValues),
        instruction2: z.enum(instructionValues),
        instruction3: z.enum(instructionValues),
        instruction4: z.enum(instructionValues),
      })
    )
    .optional(),
});

export default function AlarmForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdateMode = !!id;
  const [createAlarm, { isLoading: isCreating }] = useCreateAlarmMutation();
  const [updateAlarm, { isLoading: isUpdating }] = useUpdateAlarmMutation();
  const { data: existingData, isLoading: isFetching } = useGetAlarmByIdQuery(
    id,
    { skip: !isUpdateMode }
  );
  const isLoading = isCreating || isUpdating;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      communicatorFormat: "",
      dealerName: "",
      dealerCode: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      subscriberName: "",
      installationAddress: "",
      city: "",
      state: "",
      zip: "",
      areas: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "areas",
  });

  React.useEffect(() => {
    if (isUpdateMode && existingData) {
      const alarm = existingData.data?.alarm;
      if (alarm) {
        form.reset({
          ...alarm,
          startDate: alarm.startDate
            ? format(parseISO(alarm.startDate), "yyyy-MM-dd")
            : "",
        });
      }
    }
  }, [existingData, isUpdateMode, form]);

  async function onSubmit(values) {
    try {
      if (isUpdateMode) {
        await updateAlarm({ id, ...values }).unwrap();
        toast.success("Alarm record updated successfully!");
      } else {
        await createAlarm(values).unwrap();
        toast.success("Alarm record created successfully!");
      }
      navigate("/alarm");
    } catch (err) {
      const errorMessage = err.data?.message || `An unexpected error occurred.`;
      toast.error(errorMessage);
      if (err.data?.errors) {
        err.data.errors.forEach((error) => {
          for (const fieldName in error) {
            form.setError(fieldName, {
              type: "server",
              message: error[fieldName],
            });
          }
        });
      }
    }
  }

  if (isFetching)
    return (
      <div>
        <Skeleton className="h-screen w-full" />
      </div>
    );

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isUpdateMode ? "Update Alarm Record" : "Create New Alarm Record"}
          </h1>
          <p className="text-muted-foreground">
            {isUpdateMode
              ? "Edit the details of the alarm record."
              : "Fill in the details for a new alarm."}
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <CardTitle className="text-lg mb-4">
                  Account & Dealer Information
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 12345-ABC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="communicatorFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communicator Format</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., SIA, Contact ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dealerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dealer Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., SecureHome Inc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dealerCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dealer Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SHI-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <div>
                <CardTitle className="text-lg mb-4">
                  Subscriber & Location
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="subscriberName"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Subscriber Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installationAddress"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Installation Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-lg">Communicator Zones</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        areaNumber: 1,
                        zoneNumber: 1,
                        zoneDescription: "",
                        partitionAreaDescription: "",
                        codeDescription: "",
                        instruction1: "VN",
                        instruction2: "VN",
                        instruction3: "VN",
                        instruction4: "VN",
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Zone
                  </Button>
                </div>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-md space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium">Zone {index + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <FormField
                          control={form.control}
                          name={`areas.${index}.areaNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Area #</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`areas.${index}.zoneNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zone #</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`areas.${index}.zoneDescription`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Zone Desc.</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Front Door"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`areas.${index}.partitionAreaDescription`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Partition Desc.</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., First Floor"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`areas.${index}.codeDescription`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Code Desc.</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Fire Alarm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {[1, 2, 3, 4].map((i) => (
                          <FormField
                            key={i}
                            control={form.control}
                            name={`areas.${index}.instruction${i}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instr. {i}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {instructionValues.map((v) => (
                                      <SelectItem key={v} value={v}>
                                        {v}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No communicator zones added.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUpdateMode ? "Save Changes" : "Create Alarm Record"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
