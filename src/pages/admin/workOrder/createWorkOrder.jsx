import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation,
  useGetWorkOrderByIdQuery,
} from "@/store/GlobalApi";

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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const nameAllowedCharsRegex = /^[a-zA-Z\s\.\-]+$/;

// For Phone Numbers: Allows digits, spaces, hyphens, and underscores
const phoneNumberAllowedCharsRegex = /^(?:\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d|\d{8,15})$/;

// For Positive Numeric Decimals (and integers)
// Allows 0 and positive numbers with optional decimals.
// Use for fields like taxRate (can be 0).
const nonNegativeDecimalRegex = /^(0|[1-9]\d*)(\.\d+)?$/;

// For Strictly Positive Numeric Decimals (and integers)
// Allows positive numbers with optional decimals (cannot be 0).
// Use for fields like unitCost, totalCost.
const positiveDecimalRegex = /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/; // Matches numbers > 0 (e.g., 0.01, 5, 5.5)

const materialSchema = z.object({
  _id: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  description: z
    .string()
    .min(3, "Description is required.")
    .max(500, "Description must not exceed 500 characters."),
  // If you prefer to allow numbers in description: /^[a-zA-Z0-9\s\.\-]+$/
  unitCost: z.coerce
    .number()
    .min(0.01, "Unit cost must be a positive number.") // Changed to 0.01 to explicitly disallow 0
    .refine((val) => positiveDecimalRegex.test(val.toString()), {
      // Strictly positive decimals
      message: "Unit cost must be a positive number with optional decimals.",
    }),
  totalCost: z.coerce
    .number()
    .min(0.01, "Total cost must be a positive number.") // Changed to 0.01 to explicitly disallow 0
    .refine((val) => positiveDecimalRegex.test(val.toString()), {
      // Strictly positive decimals
      message: "Total cost must be a positive number with optional decimals.",
    }),
  taxRate: z.coerce
    .number()
    .min(0, "Tax rate cannot be negative.") // Tax rate can be 0
    .refine((val) => nonNegativeDecimalRegex.test(val.toString()), {
      // Non-negative decimals
      message: "Tax rate must be a non-negative number with optional decimals.",
    }),
});

const formSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name is required.")
    .regex(
      nameAllowedCharsRegex,
      "Customer name can only contain letters, spaces, dots, and hyphens."
    ),
  emailAddress: z.string().email("Invalid email address."), // Email has its own   specific format
  phoneNumber: z
    .string()
    .regex(
      phoneNumberAllowedCharsRegex,
      "Customer name can only contain letters, spaces, dots, and hyphens."
    ),
  jobNumber: z
    .string()
    .min(1, "Job number is required."),
    // Job numbers often contain hyphens and numbers, potentially letters.
    // Adjust this regex if you need specific format (e.g., allow alphanumeric and hyphens)
    // For now, allowing typical name chars (letters, spaces, dots, hyphens)
   
  technicianName: z
    .string()
    .min(2, "Technician name is required.")
    .regex(
      nameAllowedCharsRegex,
      "Technician name can only contain letters, spaces, dots, and hyphens."
    ),
    contactName: z
    .string()
    .min(2, "Contact name is required.")
    .regex(
      nameAllowedCharsRegex,
      "Technician name can only contain letters, spaces, dots, and hyphens."
    ),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 characters.")
    .max(15, "Contact number must not exceed 15 characters.")
    .regex(
      phoneNumberAllowedCharsRegex,
      "Contact number can only contain numbers."
    ),
  paymentMethod: z
    .string()
    .min(1, "Payment method is required."),
  date: z.date({ required_error: "A date is required." }),
  materialList: z.array(materialSchema).optional(),
});
export default function WorkOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdateMode = !!id;

  const [noTax, setNoTax] = useState({});

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
      phoneNumber: "123112312312",
      jobNumber: "",
      technicianName: "",
      contactName: "",
      contactNumber: "",
      paymentMethod: "",
      date: new Date(),
      materialList: [],
    },
  });

  const { control, setValue, getValues } = form;

  useEffect(() => {
    if (isUpdateMode && existingData) {
      const workOrder = existingData.data.workOrder;
      form.reset({
        ...workOrder,
        date: new Date(workOrder.date),
      });

      const initialNoTaxState = {};
      workOrder.materialList.forEach((material, index) => {
        if (material.taxRate === 0) {
          initialNoTaxState[index] = true;
        }
      });
      setNoTax(initialNoTaxState);
    }
  }, [existingData, isUpdateMode, form]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materialList",
  });

  const watchedMaterials = useWatch({
    control,
    name: "materialList",
  });

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalTaxes = 0;

    if (watchedMaterials) {
      watchedMaterials.forEach((material) => {
        const quantity = parseFloat(material.quantity) || 0;
        const unitCost = parseFloat(material.unitCost) || 0;
        const taxRate = parseFloat(material.taxRate) || 0;

        const itemTotal = quantity * unitCost;
        subtotal += itemTotal;

        if (taxRate > 0) {
          totalTaxes += itemTotal * (taxRate / 100);
        }
      });
    }

    return {
      subtotal: subtotal.toFixed(2),
      taxes: totalTaxes.toFixed(2),
      total: (subtotal + totalTaxes).toFixed(2),
    };
  }, [watchedMaterials]);

  useEffect(() => {
    if (watchedMaterials) {
      watchedMaterials.forEach((material, index) => {
        const quantity = parseFloat(material.quantity) || 0;
        const unitCost = parseFloat(material.unitCost) || 0;
        const total = quantity * unitCost;

        const currentTotalInForm = getValues(`materialList.${index}.totalCost`);

        if (total !== currentTotalInForm) {
          setValue(`materialList.${index}.totalCost`, total, {
            shouldValidate: false,
          });
        }
      });
    }
  }, [watchedMaterials, setValue, getValues]);

  const handleNoTaxChange = (index, checked) => {
    setNoTax((prev) => ({ ...prev, [index]: checked }));
    if (checked) {
      setValue(`materialList.${index}.taxRate`, 0, { shouldValidate: true });
    }
  };

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
                {/* <FormField
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
                /> */}
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
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
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
                  className=""
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"mt-2"}>Payment Method</FormLabel>
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
                          <SelectItem value="n/a">Not Applicable</SelectItem>
                          <SelectItem value="credit">Credit Card</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
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
                      <div className="col-span-12 sm:col-span-3">
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
                      <div className="col-span-4 sm:col-span-1">
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
                      <div className="col-span-8 sm:col-span-3">
                        <FormField
                          control={control}
                          name={`materialList.${index}.taxRate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Tax Rate (%)
                              </FormLabel>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Tax Rate %"
                                    {...field}
                                    disabled={noTax[index]}
                                    className={cn(
                                      noTax[index] &&
                                        "bg-muted cursor-not-allowed"
                                    )}
                                  />
                                </FormControl>
                                <div className="flex items-center space-x-2 pt-1">
                                  <Checkbox
                                    id={`noTax-${index}`}
                                    checked={noTax[index] || false}
                                    onCheckedChange={(checked) =>
                                      handleNoTaxChange(index, checked)
                                    }
                                  />
                                  <label
                                    htmlFor={`noTax-${index}`}
                                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    No Tax
                                  </label>
                                </div>
                              </div>
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
                      taxRate: 7,
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </div>

              <div className="flex justify-end pt-4">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes:</span>
                    <span>${totals.taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totals.total}</span>
                  </div>
                </div>
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
