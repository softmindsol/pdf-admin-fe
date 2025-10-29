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
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// 2. The component accepts `control` from the main useForm hook
export function HydrantsAndValves({ control }) {
  return (
    <AccordionItem value="item-7">
      <AccordionTrigger>Hydrants & Control Valves</AccordionTrigger>
      <AccordionContent className="p-4">
        {/* --- Hydrants & Control Valves Subsection --- */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Number of Hydrants Field */}
            <FormField
              control={control}
              name="hydrantsAndControlValves.numberOfHydrants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Hydrants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 5"
                      {...field}
                      min={0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hydrant Make and Type Field */}
            <FormField
              control={control}
              name="hydrantsAndControlValves.hydrantMakeAndType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hydrant Make and Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mueller Super Centurion 250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 mb-6">
             {/* All Operate Satisfactorily Field */}
            <FormField
              control={control}
              name="hydrantsAndControlValves.allOperateSatisfactorily"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>All Hydrants Operate Satisfactorily?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Water Control Valves Left Wide Open Field */}
            <FormField
              control={control}
              name="hydrantsAndControlValves.waterControlValvesLeftWideOpen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Water Control Valves Left Wide Open?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Hose Threads Interchangeable Field */}
            <FormField
              control={control}
              name="hydrantsAndControlValves.hoseThreadsInterchangeable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Hose Threads of Fire Department Connections are Interchangeable?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Valves Not Open Explanation Field */}
          <FormField
            control={control}
            name="hydrantsAndControlValves.valvesNotOpenExplanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation for Valves Not Left Open</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="If any control valves were not left wide open, explain the reason here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}