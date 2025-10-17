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
export function LeakageTest({ control }) {
  return (
    <AccordionItem value="item-6">
      <AccordionTrigger>Leakage Test</AccordionTrigger>
      <AccordionContent className="p-4 space-y-6">
        
        {/* --- Leakage Test Subsection --- */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Measured Leakage */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-center mb-2">Measured Leakage</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="leakageTest.leakeageGallons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gallons</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1.5" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="leakageTest.leakageHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Allowable Leakage */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-center mb-2">Allowable Leakage</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="leakageTest.allowableLeakageGallons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gallons</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2.0" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={control}
                  name="leakageTest.allowableLeakageHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Forward Flow Test Field */}
          <div className="mt-6">
            <FormField
              control={control}
              name="leakageTest.forwardFlowTestPerformed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Forward Flow Test Performed on Backflow Preventer?</FormLabel>
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