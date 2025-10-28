import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  useCreateUserMutation,
  useGetDepartmentsQuery,
} from "@/store/GlobalApi";
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
import { getUserData } from "@/lib/auth";
import { toast } from "sonner";

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
    email: z
      .string()
      .email("Please provide a valid email address.")
      .optional()
      .or(z.literal("")),
    role: z.enum(["user", "manager"], { required_error: "Role is required." }),
    department: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Department ID format")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function CreateUser() {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- MODIFIED: Fetch departments and handle loading state ---
  const { data: departmentResponse, isLoading: areDepartmentsLoading } =
    useGetDepartmentsQuery({ page: 0 });
  const departments = departmentResponse?.data?.departments || [];
  const user = getUserData();
  console.log("🚀 ~ CreateUser ~ user:", user);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      role: "user",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    const payload = { ...values };
    delete payload.confirmPassword;
    if (!payload.department) delete payload.department;
    if (!payload.email) delete payload.email;

    try {
      await createUser(payload).unwrap();
      toast.success("User created.")
      navigate("/user");
    } catch (err) {
      if (err.data?.errors?.[0]?.username) {
        form.setError("username", {
          type: "manual",
          message: err.data.errors[0].username,
        });
      } else {
        console.error("Failed to create user:", err);
      }
    }
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New User</h1>
          <p className="text-muted-foreground">
            Fill in the details to add a new user to the system.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            The password must be at least 8 characters long.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* --- User Naming --- */}
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

              {/* --- Credentials --- */}
              <div className="grid sm:grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- Role & Department --- */}
              {!user?.department && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* --- REPLACED: Department Input with Select Dropdown --- */}
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={areDepartmentsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {areDepartmentsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              departments.map((dept) => (
                                <SelectItem key={dept._id} value={dept._id}>
                                  {dept.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Separator />

              {/* --- Password Section --- */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="*********"
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="*********"
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create User
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
