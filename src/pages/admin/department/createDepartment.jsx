import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    useCreateDepartmentMutation,
} from "@/store/GlobalApi";
import { ArrowLeft, Loader2 } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
    name: z.string().min(2, "Department name must be at least 2 characters."),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
    allowedForms: z.array(z.string()).default([]),
});

const formOptions = [
    { id: "AboveGround", label: "Above Ground" },
    { id: "serviceTicket", label: "Service Ticket" },
    { id: "underGround", label: "Under Ground" },
    { id: "workOrder", label: "Work Order" },
    { id: "customer", label: "Customer" },
    { id: "alarm", label: "Alarm Monitor" },
];

export default function CreateDepartment() {
    const navigate = useNavigate();

    const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "active",
            allowedForms: []
        },
    });

    async function onSubmit(values) {
        try {
            await createDepartment(values).unwrap();
            toast.success("Department created successfully.");
            navigate("/department");
        } catch (err) {
            if (err.data?.errors?.[0]?.name) {
                form.setError("name", {
                    type: "manual",
                    message: err.data.errors[0].name,
                });
            } else if (err.data?.message) {
                toast.error(err.data.message);
            } else {
                toast.error("Failed to create department.");
                console.error("Failed to create department:", err);
            }
        }
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
                    <h1 className="text-2xl font-bold tracking-tight">Create Department</h1>
                    <p className="text-muted-foreground">
                        Add a new department to your organization.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Department Details</CardTitle>
                    <CardDescription>
                        Fill in the information below to create a new department.
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
                                                <Input placeholder="e.g., Fire Safety" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
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

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Brief description of the department" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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
                                                Select which forms can be associated with this department.
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
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Create Department
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
