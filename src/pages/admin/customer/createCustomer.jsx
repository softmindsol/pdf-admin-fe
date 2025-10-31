import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomerByIdQuery,
} from "@/store/GlobalApi";

// --- UI Imports ---
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

// --- Zod Schema for Customer Form Validation ---
const nameAllowedCharsRegex = /^[a-zA-Z\s\.\-]+$/;

// For Addresses: Allows letters, numbers, spaces, dots, hyphens, and commas.
const addressAllowedCharsRegex = /^[a-zA-Z0-9\s\.\,\-]+$/;

// For Phone Numbers: Allows digits, spaces, hyphens, and underscores.
const phoneNumberAllowedCharsRegex = /^\+?[0-9]+$/
;

 const formSchema = z.object({
  // Customer Information
  customerName: z
    .string()
    .min(2, "Customer name is required.")
    .regex(nameAllowedCharsRegex, "Customer name can only contain letters, spaces, dots, and hyphens."),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters.")
    .max(15, "Phone number must not exceed 15 characters.")
    .regex(
      phoneNumberAllowedCharsRegex,
      "Phone number can only contain numbers."
    ),
  emailForInspectionReports: z.string().email("Invalid email address."),

  // On-Site Contact
  onSiteContactName: z
    .string()
    .min(2, "On-site contact name is required.")
    .regex(nameAllowedCharsRegex, "On-site contact name can only contain letters, spaces, dots, and hyphens."),
  onSitePhoneNumber: z
    .string()
    .min(10, "On-site phone number must be at least 10 characters.")
    .max(15, "On-site phone number must not exceed 15 characters.")
    .regex(
      phoneNumberAllowedCharsRegex,
      "On-site phone number can only contain numbers."
    ),
  onSiteEmailAddress: z.string().email("Invalid on-site email address."),

  // Site Information
  buildingName: z
    .string()
    .min(2, "Building name is required.")
    .regex(nameAllowedCharsRegex, "Building name can only contain letters, spaces, dots, and hyphens."),
  typeOfSite: z
    .string()
    .min(2, "Type of site is required.")
    .regex(nameAllowedCharsRegex, "Type of site can only contain letters, spaces, dots, and hyphens."),
  siteAddress: z
    .string()
    .min(5, "A valid site address is required.")
    .regex(addressAllowedCharsRegex, "Site address can only contain letters, numbers, spaces, dots, commas, and hyphens."),

  // Billing Information
  billingName: z
    .string()
    .min(2, "Billing name is required.")
    .regex(nameAllowedCharsRegex, "Billing name can only contain letters, spaces, dots, and hyphens."),
  billingContactNumber: z
    .string()
    .min(10, "Billing contact number must be at least 10 characters.")
    .max(15, "Billing contact number must not exceed 15 characters.")
    .regex(
      phoneNumberAllowedCharsRegex,
      "Billing contact number can only contain numbers."
    ),
  billingEmailAddress: z.string().email("Invalid billing email address."),

  // Owner’s Information
  ownerName: z
    .string()
    .min(2, "Owner's name is required.")
    .regex(nameAllowedCharsRegex, "Owner's name can only contain letters, spaces, dots, and hyphens."),
  ownerContactNumber: z
    .string()
    .min(10, "Owner contact number must be at least 10 characters.")
    .max(15, "Owner contact number must not exceed 15 characters.")
    .regex(
      phoneNumberAllowedCharsRegex,
      "Owner contact number can only contain numbers."
    ),
  ownerAddress: z
    .string()
    .min(5, "A valid owner address is required.")
    .regex(addressAllowedCharsRegex, "Owner's address can only contain letters, numbers, spaces, dots, commas, and hyphens."),
  ownerEmailAddress: z.string().email("Invalid owner's email address."),

  // Certificates
  taxExemptCertificate: z.boolean().default(false),
  directPayCertificate: z.boolean().default(false),
});

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isUpdateMode = !!id;

  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const { data: existingData, isLoading: isFetching } = useGetCustomerByIdQuery(
    id,
    {
      skip: !isUpdateMode,
    }
  );

  const isLoading = isCreating || isUpdating;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      emailForInspectionReports: "",
      onSiteContactName: "",
      onSitePhoneNumber: "",
      onSiteEmailAddress: "",
      buildingName: "",
      typeOfSite: "",
      siteAddress: "",
      billingName: "",
      billingContactNumber: "",
      billingEmailAddress: "",
      ownerName: "",
      ownerContactNumber: "",
      ownerAddress: "",
      ownerEmailAddress: "",
      taxExemptCertificate: false,
      directPayCertificate: false,
    },
  });

  useEffect(() => {
    if (isUpdateMode && existingData) {
      const customer = existingData.data.customer;
      form.reset(customer);
    }
  }, [existingData, isUpdateMode, form]);

  async function onSubmit(values) {
    try {
      if (isUpdateMode) {
        await updateCustomer({ id, ...values }).unwrap();
      } else {
        await createCustomer(values).unwrap();
      }
      navigate("/customer");
    } catch (err) {
      if (err.data?.errors?.[0]?.customerName) {
        form.setError("customerName", {
          type: "manual",
          message: err.data.errors[0].customerName,
        });
      } else {
        console.error(
          `Failed to ${isUpdateMode ? "update" : "create"} customer:`,
          err
        );
      }
    }
  }

  if (isFetching) {
    // Skeleton loading state remains the same
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="h-px w-full" />
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
            {isUpdateMode ? "Update Customer" : "Create New Customer"}
          </h1>
          <p className="text-muted-foreground">
            {isUpdateMode
              ? "Edit the details of the customer."
              : "Fill in the details for the new customer."}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* --- Customer Information Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">
                  Customer Information
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 111-2222" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailForInspectionReports"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email for Reports</FormLabel>
                        <FormControl>
                          <Input placeholder="reports@acme.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* --- On-Site Contact Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">On-Site Contact</CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="onSiteContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onSitePhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 333-4444" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onSiteEmailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.s@acme.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* --- Site Information Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">Site Information</CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="buildingName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Main Facility" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typeOfSite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Site</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Warehouse, Office"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siteAddress"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel>Site Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Industrial Way, Anytown, USA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* --- Billing Information Section (FIXED) --- */}
              <div>
                <CardTitle className="text-lg mb-4">
                  Billing Information
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="billingName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Accounts Payable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingContactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingEmailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="ap@acme.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* --- Owner's Information Section (FIXED) --- */}
              <div>
                <CardTitle className="text-lg mb-4">
                  Owner's Information
                </CardTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerContactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 999-8888" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerEmailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="jane.doe@owner.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerAddress"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel>Owner Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="456 Corporate Blvd, Anytown, USA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* --- Certificates Section --- */}
              <div>
                <CardTitle className="text-lg mb-4">Certificates</CardTitle>
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="taxExemptCertificate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Tax Exempt
                          </FormLabel>
                          <FormDescription>
                            This customer has a tax-exempt certificate on file.
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
                  <FormField
                    control={form.control}
                    name="directPayCertificate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Direct Pay
                          </FormLabel>
                          <FormDescription>
                            This customer has a direct pay certificate on file.
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
                  {isUpdateMode ? "Save Changes" : "Create Customer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
