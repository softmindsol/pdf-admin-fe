import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useChangeUsernameMutation } from "@/store/GlobalApi";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// --- Zod Validation Schema ---
const formSchema = z.object({
  newUsername: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .regex(
      /^[a-z][a-z0-9]+$/,
      "Username must start with a letter and contain only lowercase letters and numbers."
    ),
  password: z.string().min(1, "Password is required to confirm your identity."),
});

export default function ChangeUsername() {
  const navigate = useNavigate();
  const [changeUsername, { isLoading }] = useChangeUsernameMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newUsername: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      await changeUsername(values).unwrap();
      toast.success("Username changed successfully!");
      navigate(-1); // Go back to the previous page
    } catch (err) {
      const field = err.data?.errors?.[0]?.newUsername ? "newUsername" : "password";
      const message = err.data?.message || "An unexpected error occurred.";

      form.setError(field, {
        type: "manual",
        message: message,
      });
      console.error("Failed to change username:", err);
    }
  }

  return (
    <div className="w-full max-w-2xl  p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Change Username</h1>
          <p className="text-muted-foreground">
            Enter a new username and your current password.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Your Username</CardTitle>
          <CardDescription>
            This change will affect how you log in. Please enter your password
            to confirm this action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* --- New Username --- */}
              <FormField
                control={form.control}
                name="newUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Username</FormLabel>
                    <FormControl>
                      <Input placeholder="newcoolname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Password for Confirmation --- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Username
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}