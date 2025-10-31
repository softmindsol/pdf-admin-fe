import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import {
  useCreateServiceTicketMutation,
  useUpdateServiceTicketMutation,
  useGetServiceTicketByIdQuery,
} from "@/store/GlobalApi";

import { ArrowLeft, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const nameRegex = /^[a-zA-Z\s\-]+$/;
const generalTextRegex = /^[a-zA-Z0-9\s\.\,\-\_]+$/;

// For Phone Numbers: Allows ONLY digits (0-9). No spaces, no hyphens, no other characters.
const phoneNumberAllowedCharsRegex = /^\+?[0-9]+$/
;


 const formSchema = z.object({
  jobName: z
    .string()
    .min(2, "Job name is required.")
    .regex(nameRegex, "Job name can only contain letters, spaces, and hyphens."),

  customerName: z
    .string()
    .min(2, "Customer name is required.")
    .regex(nameRegex, "Customer name can only contain letters, spaces, and hyphens."),

  emailAddress: z.string().email("A valid email address is required."),

  // CORRECTED: Strict phone number validation (digits only)
  phoneNumber: z
    .string()
    .regex(phoneNumberAllowedCharsRegex, "Phone number must only contain digits.")
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number must not exceed 15 digits."),
    
  jobLocation: z
    .string()
    .min(5, "A valid job location is required.")
    .regex(generalTextRegex, "Job location contains invalid characters."),

  workDescription: z
    .string()
    .min(10, "A detailed work description is required.")
    .max(1000, "Work description must not exceed 1000 characters."),

  materials: z
    .array(
      z.object({
        quantity: z.coerce
          .number({ invalid_type_error: "Quantity must be a number." })
          .int({ message: "Quantity must be a whole number." })
          .positive({ message: "Quantity must be a positive number." }),
        material: z.string().min(2, "Material description is required."),
      })
    )
    .optional(),

  technicianName: z
    .string()
    .min(2, "Technician name is required.")
    .regex(nameRegex, "Technician name can only contain letters, spaces, and hyphens."),

  // CORRECTED: Strict phone number validation (digits only)
  technicianContactNumber: z
    .string()
    .regex(phoneNumberAllowedCharsRegex, "Phone number must only contain digits.")
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number must not exceed 15 digits."),
    
  stHours: z.coerce.number().min(0).default(0),
  otHours: z.coerce.number().min(0).default(0),

  applySalesTax: z.boolean().default(false),
  workOrderStatus: z.enum(["Not Complete", "System Out of Order", "Complete"]),
  
  completionDate: z.coerce.date({
      required_error: "A valid completion date is required.",
      invalid_type_error: "That's not a valid date!",
    })
    .max(new Date(), { message: "Completion date cannot be in the future." }),

  customerSignature: z.string().optional(),
});

export default function ServiceTicketForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdateMode = !!id;

  const [createServiceTicket, { isLoading: isCreating }] =
    useCreateServiceTicketMutation();
  const [updateServiceTicket, { isLoading: isUpdating }] =
    useUpdateServiceTicketMutation();

  const { data: existingData, isLoading: isFetching } =
    useGetServiceTicketByIdQuery(id, {
      skip: !isUpdateMode,
    });
  console.log("🚀 ~ ServiceTicketForm ~ existingData:", existingData);

  const isLoading = isCreating || isUpdating;

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch (error) {
      return "";
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobName: "",
      customerName: "",
      emailAddress: "",
      phoneNumber: "",
      jobLocation: "",
      workDescription: "",
      materials: [],
      technicianName: "",
      technicianContactNumber: "",
      stHours: 0,
      otHours: 0,
      applySalesTax: false,
      workOrderStatus: "Not Complete",
      completionDate: format(new Date(), "yyyy-MM-dd"),
      customerSignature: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  useEffect(() => {
    if (isUpdateMode && existingData) {
      const ticket = existingData.data?.serviceTicket;

      if (ticket) {
        const formattedTicket = {
          ...ticket,
          completionDate: formatDateForInput(ticket.completionDate),
        };
        form.reset(formattedTicket);
      }
    }
  }, [existingData, isUpdateMode, form]);
  async function onSubmit(values) {
    try {
      if (isUpdateMode) {
        await updateServiceTicket({ id, ...values }).unwrap();
      } else {
        await createServiceTicket(values).unwrap();
      }
      navigate("/service-ticket");
    } catch (err) {
      console.error(
        `Failed to ${isUpdateMode ? "update" : "create"} ticket:`,
        err
      );
    }
  }

  if (isFetching) {
    return (
      <div className="w-full p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-6">
                <Separator />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isUpdateMode
              ? "Update Service Ticket"
              : "Create New Service Ticket"}
          </h1>
          <p className="text-muted-foreground">
            {isUpdateMode
              ? "Edit the details of the service ticket."
              : "Fill in the details for a new service ticket."}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* --- Job & Customer Information Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">
                  Job & Customer Information
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="jobName"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Job Name</FormLabel>{" "}
                        <FormControl>
                          <Input
                            placeholder="Quarterly HVAC Maintenance"
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Customer Name</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Phone Number</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="(555) 111-2222" {...field} />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Email Address</FormLabel>{" "}
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@acme.com"
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobLocation"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        {" "}
                        <FormLabel>Job Location / Address</FormLabel>{" "}
                        <FormControl>
                          <Input
                            placeholder="123 Industrial Way, Anytown, USA"
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* --- Work Details Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">Work Details</CardTitle>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="workDescription"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>
                          Description of Work Performed
                        </FormLabel>{" "}
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Describe the tasks completed, issues found, and resolutions..."
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* --- Materials Used Section --- */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-lg">Materials Used</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ quantity: 1, material: "" })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Material
                  </Button>
                </div>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 p-2 border rounded-md"
                    >
                      <FormField
                        control={form.control}
                        name={`materials.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Qty"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`materials.${index}.material`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Material name or description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No materials added.
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* --- Labor Information Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">
                  Labor Information
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="technicianName"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Technician Name</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="technicianContactNumber"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Technician Contact</FormLabel>{" "}
                        <FormControl>
                          <Input placeholder="(555) 999-8888" {...field} />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stHours"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Straight Time (Hours)</FormLabel>{" "}
                        <FormControl>
                          <Input
                            type="number"
                            step="0.25"
                            placeholder="e.g., 8.5"
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otHours"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Overtime (Hours)</FormLabel>{" "}
                        <FormControl>
                          <Input
                            type="number"
                            step="0.25"
                            placeholder="e.g., 2.0"
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* --- Status & Financials Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">
                  Status & Financials
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="workOrderStatus"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Work Order Status</FormLabel>{" "}
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {" "}
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>{" "}
                          <SelectContent>
                            {" "}
                            <SelectItem value="Not Complete">
                              Not Complete
                            </SelectItem>{" "}
                            <SelectItem value="System Out of Order">
                              System Out of Order
                            </SelectItem>{" "}
                            <SelectItem value="Complete">Complete</SelectItem>{" "}
                          </SelectContent>{" "}
                        </Select>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="completionDate"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Completion Date</FormLabel>{" "}
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applySalesTax"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-full">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Apply Sales Tax
                          </FormLabel>
                          <FormDescription>
                            Enable if sales tax is applicable for this ticket.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUpdateMode ? "Save Changes" : "Create Ticket"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
