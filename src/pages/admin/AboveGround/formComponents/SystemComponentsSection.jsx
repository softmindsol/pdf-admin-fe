// src/components/forms/above-ground-test/SystemComponentsSection.jsx

import React from 'react';
import { useFieldArray } from "react-hook-form";
import { FormField, FormControl, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";

export function SystemComponentsSection({ control }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "systemComponents.sprinklers",
    });

    return (
        <AccordionItem value="system-components">
            <AccordionTrigger className="text-xl font-semibold">
                3. System Components
            </AccordionTrigger>
            <AccordionContent asChild>
                <Card className="border-none">
                    <CardContent className="pt-6 space-y-6">
                        <h3 className="text-lg font-medium">Piping & Fittings</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={control}
                                name="systemComponents.pipeAndFittings.pipeType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pipe Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Schedule 40 Black Steel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="systemComponents.pipeAndFittings.fittingsType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fittings Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Grooved, Threaded" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        <h3 className="text-lg font-medium">Sprinklers</h3>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="border p-4 rounded-md relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <FormField
                                        control={control}
                                        name={`systemComponents.sprinklers.${index}.make`}
                                        render={({ field }) => (
                                            <FormItem><FormLabel>Make</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`systemComponents.sprinklers.${index}.model`}
                                        render={({ field }) => (
                                            <FormItem><FormLabel>Model</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`systemComponents.sprinklers.${index}.yearOfMfg`}
                                        render={({ field }) => (
                                            <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="2023" {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`systemComponents.sprinklers.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`systemComponents.sprinklers.${index}.orificeSize`}
                                        render={({ field }) => (
                                            <FormItem><FormLabel>Orifice Size</FormLabel><FormControl><Input placeholder="1.5 in" {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`systemComponents.sprinklers.${index}.tempRating`}
                                        render={({ field }) => (
                                            <FormItem><FormLabel>Temp. Rating</FormLabel><FormControl><Input placeholder="165F" {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-3 -right-3"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-5 w-5 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            // Append a new sprinkler object with default empty values
                            onClick={() => append({ make: "", model: "", yearOfMfg: "", orificeSize: "", quantity: "", tempRating: "" })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Sprinkler Type
                        </Button>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
    );
}