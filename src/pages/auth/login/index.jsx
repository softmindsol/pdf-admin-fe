import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock, User2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

import LoginImage from "/logofull-white.svg";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginMutation } from "@/store/GlobalApi";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain letters, numbers, dots, hyphens, and underscores"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export default function LoginPage() {
  const [login, { data, error, isLoading, isSuccess, isError, reset }] =
    useLoginMutation();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorQuery = params.get("error");

    if (errorQuery) {
      const formattedMessage = errorQuery
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      toast.error(formattedMessage, { id: "url-error-toast" });

      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const onSubmit = (values) => {
    login(values);
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message || "Login successful!");
      navigate("/");
    }
  }, [isSuccess, data, navigate]);

  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        error.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <section className="bg-gradient-to-r from-[#BE0200] to-[#FB7F09]">
      <div className="container  mx-auto min-h-screen flex items-center justify-center p-4">
        {" "}
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:flex justify-center">
            <img
              src={LoginImage}
              alt="Login illustration"
              className="max-w-full h-auto rounded-lg"
            />
          </div>

          <div className="w-full max-w-xl  mx-auto">
            <Card className="shadow-lg border-0 py-10 bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-4 text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#BE0200] to-[#FB7F09] bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Username Field */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Username
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User2 className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Enter your username"
                                className="pl-10 h-12 border-gray-200 focus:border-[#FB7F09] focus:ring-[#FB7F09]/20"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-12 h-12 border-gray-200 focus:border-[#FB7F09] focus:ring-[#FB7F09]/20"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      disabled={isLoading}
                      className="w-full h-12 text-base font-semibold"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
