import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// --- UPDATED: Import useWatch ---
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation,
  useGetWorkOrderByIdQuery,
} from "@/store/GlobalApi";

// --- (No changes to imports below this line) ---
import {
  ArrowLeft,
  Loader2,
  CalendarIcon,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// --- (No changes to Zod schemas) ---
const materialSchema = z.object({
  _id: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  description: z.string().min(3, "Description is required."),
  unitCost: z.coerce.number().min(0, "Unit cost cannot be negative."),
  totalCost: z.coerce.number(),
});

const formSchema = z.object({
  customerName: z.string().min(2, "Customer name is required."),
  emailAddress: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(10, "Phone number is required."),
  jobNumber: z.string().min(1, "Job number is required."),
  technicianName: z.string().min(2, "Technician name is required."),
  contactNumber: z.string().min(10, "Contact number is required."),
  paymentMethod: z.string().min(1, "Payment method is required."),
  date: z.date({ required_error: "A date is required." }),
  materialList: z.array(materialSchema).optional(),
});

export default function WorkOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdateMode = !!id;

  const [createWorkOrder, { isLoading: isCreating }] =
    useCreateWorkOrderMutation();
  const [updateWorkOrder, { isLoading: isUpdating }] =
    useUpdateWorkOrderMutation();

  const { data: existingData, isLoading: isFetching } =
    useGetWorkOrderByIdQuery(id, {
      skip: !isUpdateMode,
    });

  const isLoading = isCreating || isUpdating;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      emailAddress: "",
      phoneNumber: "",
      jobNumber: "",
      technicianName: "",
      contactNumber: "",
      paymentMethod: "",
      date: new Date(),
      materialList: [],
    },
  });

  // --- UPDATED: Destructure control and setValue from form ---
  const { control, setValue, getValues } = form;

  useEffect(() => {
    if (isUpdateMode && existingData) {
      const workOrder = existingData.data.workOrder;
      form.reset({
        ...workOrder,
        date: new Date(workOrder.date),
      });
    }
  }, [existingData, isUpdateMode, form]);

  const { fields, append, remove } = useFieldArray({
    control, // Use control here
    name: "materialList",
  });

  // --- UPDATED: Use the useWatch hook for reliable updates ---
  const watchedMaterials = useWatch({
    control,
    name: "materialList",
  });

  // --- UPDATED: This useEffect is now more robust ---
  useEffect(() => {
    if (watchedMaterials) {
      watchedMaterials.forEach((material, index) => {
        const quantity = parseFloat(material.quantity) || 0;
        const unitCost = parseFloat(material.unitCost) || 0;
        const total = quantity * unitCost;

        // Get the current total from the form state to avoid unnecessary updates
        const currentTotalInForm = getValues(`materialList.${index}.totalCost`);

        // Only update if the calculated total is different
        if (total !== currentTotalInForm) {
          setValue(`materialList.${index}.totalCost`, total, {
            shouldValidate: false, // Prevent re-validating on every keystroke
          });
        }
      });
    }
  }, [watchedMaterials, setValue, getValues]);

  async function onSubmit(values) {
    try {
      if (isUpdateMode) {
        await updateWorkOrder({ id, ...values }).unwrap();
      } else {
        await createWorkOrder(values).unwrap();
      }
      navigate("/work-order");
    } catch (err) {
      if (err.data?.errors?.[0]?.jobNumber) {
        form.setError("jobNumber", {
          type: "manual",
          message: err.data.errors[0].jobNumber,
        });
      } else {
        console.error(
          `Failed to ${isUpdateMode ? "update" : "create"} work order:`,
          err
        );
      }
    }
  }

  if (isFetching) {
    // --- (Skeleton loading state remains the same) ---
    return (
      <div className="w-full p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    // --- (The rest of the JSX form remains exactly the same) ---
    <div className="w-full p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isUpdateMode ? "Update Work Order" : "Create New Work Order"}
          </h1>
          <p className="text-muted-foreground">
            {isUpdateMode
              ? "Edit the details of the work order."
              : "Fill in the details for the new work order."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="jane.smith@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="jobNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="WO-10234"
                          {...field}
                          disabled={isUpdateMode}
                          className={
                            isUpdateMode ? "bg-muted cursor-not-allowed" : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="technicianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technician Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mike Rowe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Date of Work</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Credit Card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="invoice">Invoice</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div>
                <CardTitle className="text-lg mb-4">Materials Used</CardTitle>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-x-4 gap-y-2 items-start p-3 border rounded-lg relative"
                    >
                      <div className="col-span-12 sm:col-span-5">
                        <FormField
                          control={control}
                          name={`materialList.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., HVAC Filter"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <FormField
                          control={control}
                          name={`materialList.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Qty</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <FormField
                          control={control}
                          name={`materialList.${index}.unitCost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Unit Cost ($)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="25.50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <FormField
                          control={control}
                          name={`materialList.${index}.totalCost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Total ($)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  readOnly
                                  className="bg-muted"
                                  placeholder="25.50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-12 sm:col-span-1 flex justify-end items-center mt-2 sm:mt-0 sm:self-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    append({
                      description: "",
                      quantity: 1,
                      unitCost: 0,
                      totalCost: 0,
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUpdateMode ? "Save Changes" : "Create Work Order"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
