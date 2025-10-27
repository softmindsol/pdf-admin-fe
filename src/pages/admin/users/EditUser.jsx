import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useGetUserByIdQuery, useUpdateUserMutation } from "@/store/GlobalApi";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Zod Validation Schema ---
const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters.")
      .regex(/^[a-zA-Z]+$/, "First name can only contain letters."),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters.")
      .regex(/^[a-zA-Z]+$/, "Last name can only contain letters."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    status: z.enum(["active", "inactive"]),
    role: z.enum(["user", "manager", "admin"], {
      required_error: "Role is required.",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading: isUserLoading,
    isError,
  } = useGetUserByIdQuery(id, { skip: !id });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const user = response?.data?.user;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      status: "active", // Set default value
      role: "user", // Set default value
      password: "",
      confirmPassword: "",
    },
  });

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      console.log("Fetched user data:", user); // Debug fetched data

      // Validate and set proper values
      const validRole = ["user", "manager", "admin"].includes(user.role)
        ? user.role
        : "user";
      const validStatus = ["active", "inactive"].includes(user.status)
        ? user.status
        : "active";

      const formData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        status: validStatus,
        role: validRole,
        password: "",
        confirmPassword: "",
      };

      console.log("Setting form data:", formData); // Debug form data
      form.reset(formData);

      // Force update the form values to ensure selects are properly set
      setTimeout(() => {
        form.setValue("role", validRole);
        form.setValue("status", validStatus);
        console.log("Form values after timeout:", form.getValues()); // Debug final form state
      }, 0);
    }
  }, [user, form]);

  async function onSubmit(values) {
    console.log("Submitting form with values:", values); // Debug submitted values
    const payload = { ...values };
    if (!payload.password) {
      delete payload.confirmPassword;
      delete payload.password;
    }
    if (payload.password) {
      delete payload.confirmPassword;
    }

    try {
      await updateUser({ id, ...payload }).unwrap();
      navigate(`/user/${id}`);
    } catch (err) {
      if (err.data?.errors?.[0]?.username) {
        form.setError("username", {
          type: "manual",
          message: err.data.errors[0].username,
        });
      } else {
        console.error("Failed to update user:", err);
      }
    }
  }

  if (isUserLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
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
          <AlertDescription>Failed to load user data.</AlertDescription>
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
          <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground">
            Update the details for {user?.firstName} {user?.lastName}.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Make changes to the user's profile here. Click save when you're
            done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* --- Basic Information --- */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""} // Ensure value is never undefined
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* --- Password Update Section --- */}
              <div>
                <h3 className="text-lg font-medium">Update Password</h3>
                <p className="text-sm text-muted-foreground">
                  Leave these fields blank to keep the current password.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
