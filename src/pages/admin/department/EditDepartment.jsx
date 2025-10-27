// src/pages/EditDepartment.js

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  useGetDepartmentByIdQuery,
  useGetUsersQuery,
  useUpdateDepartmentMutation,
} from "@/store/GlobalApi";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";

import { ManagerSelectionDialog } from "@/components/dialogs/ManagerSelection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const formSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters."),
  manager: z.array(z.string()).default([]),
  allowedForms: z.array(z.string()).default([]),
});

const formOptions = [
  { id: "AboveGround", label: "Above Ground" },
  { id: "serviceTicket", label: "Service Ticket" },
  { id: "underGround", label: "Under Ground" },
  { id: "workOrder", label: "Work Order" },
  { id: "customer", label: "Customer" },
];

// Constant to control how many badges are visible before collapsing
const VISIBLE_MANAGERS_LIMIT = 3;

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isManagerDialogOpen, setManagerDialogOpen] = useState(false);

  const { data: usersResponse } = useGetUsersQuery(
    { page: 0, department: id },
    { skip: !id }
  );
  console.log("🚀 ~ EditDepartment ~ usersResponse:", usersResponse)

  const allUsers = usersResponse?.data?.users || [];

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
    defaultValues: { name: "", manager: [], allowedForms: [] },
  });

  const selectedManagerIds = form.watch("manager");
  const usersMap = useMemo(
    () => new Map(allUsers.map((user) => [user._id, user])),
    [allUsers]
  );
  const selectedManagers = useMemo(
    () =>
      (selectedManagerIds || []).map((id) => usersMap.get(id)).filter(Boolean),
    [selectedManagerIds, usersMap]
  );

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name || "",
        manager: department.manager?.map((m) => m._id) || [],
        allowedForms: department.allowedForms || [],
      });
    }
  }, [department, form]);

  const handleSaveManagers = (newManagerIds) => {
    form.setValue("manager", newManagerIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  async function onSubmit(values) {
    try {
      await updateDepartment({ id, ...values }).unwrap();
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/department")}
        >
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
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

                {/* --- THIS IS THE CORRECTED MANAGER SELECTION UI --- */}
                <FormField
                  control={form.control}
                  name="manager"
                  render={() => {
                    const visibleManagers = selectedManagers.slice(
                      0,
                      VISIBLE_MANAGERS_LIMIT
                    );
                    const remainingCount =
                      selectedManagers.length - VISIBLE_MANAGERS_LIMIT;

                    return (
                      <FormItem className={''}>
                        <FormLabel className={'py-3'}>Managers</FormLabel>
                        <div className="flex flex-col gap-3">
                          <div className="min-h-[40px] w-full rounded-md border border-input p-2 flex items-center gap-2">
                            {selectedManagers.length > 0 ? (
                              <>
                                {visibleManagers.map((user) => (
                                  <Badge key={user._id} variant="secondary">
                                    {user.firstName} {user.lastName}
                                  </Badge>
                                ))}
                                {remainingCount > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-accent"
                                    onClick={() => setManagerDialogOpen(true)}
                                  >
                                    +{remainingCount} more
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground px-1">
                                No managers selected
                              </span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-fit"
                            onClick={() => setManagerDialogOpen(true)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {selectedManagers.length > 0
                              ? "Edit Managers"
                              : "Select Managers"}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              {/* Allowed Forms section */}
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
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? field.onChange([
                                          ...field.value,
                                          option.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (v) => v !== option.id
                                          )
                                        )
                                  }
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

      <ManagerSelectionDialog
        open={isManagerDialogOpen} id={id}
        onOpenChange={setManagerDialogOpen}
        initialSelectedIds={selectedManagerIds}
        onSave={handleSaveManagers}
      />
    </div>
  );
}
