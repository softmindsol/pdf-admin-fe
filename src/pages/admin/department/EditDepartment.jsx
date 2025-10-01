import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  useGetDepartmentByIdQuery,
  useGetUsersQuery,
  useUpdateDepartmentMutation,
} from "@/store/GlobalApi";
import { ArrowLeft, Loader2 } from "lucide-react";

// --- Shadcn UI Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

// --- Zod Schema (FIXED) ---
const formSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters."),
  // REMOVED the strict regex. The form only needs to handle strings.
  // The backend will validate the ObjectId.
  manager: z.string().optional().or(z.literal("")),
  allowedForms: z.array(z.string()).default([]),
});

const formOptions = [
  { id: "AboveGround", label: "Above Ground" },
  { id: "serviceTicket", label: "Service Ticket" },
  { id: "underGround", label: "Under Ground" },
  { id: "workOrder", label: "Work Order" },
];

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: usersResponse, isLoading: areUsersLoading } = useGetUsersQuery(
    {
      page: 0,
      department: id,
    },
    {
      skip: !id,
    }
  );
  const departmentUsers = usersResponse?.data?.users || [];

  const {
    data: response,
    isLoading: isDepartmentLoading,
    isError,
  } = useGetDepartmentByIdQuery(id, { skip: !id });

  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();

  const department = response?.data?.department;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      manager: "",
      allowedForms: [],
    },
  });

  useEffect(() => {
    if (department) {
      const formData = {
        name: department.name || "",
        manager:
          typeof department.manager === "object"
            ? department.manager?._id
            : department.manager || "",
        allowedForms: department.allowedForms || [],
      };
      form.reset(formData);
    }
  }, [department, form]);

  // --- onSubmit Function (FIXED) ---
  async function onSubmit(values) {
    const payload = { ...values };
    // If manager is our special placeholder or empty, set it to actual null for the API.
    if (payload.manager === "--" || !payload.manager) {
      payload.manager = null;
    }

    try {
      await updateDepartment({ id, ...payload }).unwrap();
      navigate(`/department/${id}`);
    } catch (err) {
      if (err.data?.errors?.[0]?.name) {
        form.setError("name", {
          type: "manual",
          message: err.data.errors[0].name,
        });
      } else {
        console.error("Failed to update department:", err);
      }
    }
  }

  if (isDepartmentLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-40" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load department data.</AlertDescription>
        </Alert>
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Department</h1>
          <p className="text-muted-foreground">
            Update the details for the {department?.name} department.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
          <CardDescription>
            Make changes to the department here. Click save when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={areUsersLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* --- SelectItem for "None" (FIXED) --- */}
                          <SelectItem value="--">None</SelectItem>
                          {departmentUsers.map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              {`${user.firstName} ${user.lastName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Allowed Forms section remains the same */}
              <FormField
                control={form.control}
                name="allowedForms"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Allowed Forms</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Select which forms can be associated with this
                        department.
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {formOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="allowedForms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          option.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
