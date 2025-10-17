import React from "react";

// 1. Import necessary components from shadcn/ui
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// 2. The component accepts `control` from the main useForm hook
export function HydrostaticTest({ control }) {
  return (
    <AccordionItem value="item-5">
      <AccordionTrigger>Hydrostatic Test</AccordionTrigger>
      <AccordionContent className="p-4">
        {/* --- Hydrostatic Test Subsection --- */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Tested At PSI Field */}
            <FormField
              control={control}
              name="hydrostaticTest.testedAtPSI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tested At (PSI)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 200"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} // Ensure value is a number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tested Hours Field */}
            <FormField
              control={control}
              name="hydrostaticTest.testedHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tested For (Hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 2"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} // Ensure value is a number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Joints Covered Field */}
            <FormField
              control={control}
              name="hydrostaticTest.jointsCovered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-full">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Joints Covered During Test?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}