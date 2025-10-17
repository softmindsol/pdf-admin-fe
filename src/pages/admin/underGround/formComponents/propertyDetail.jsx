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
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// 2. The component accepts `control` from the main useForm hook
export function PropertyDetailsSection({ control }) {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Property Details</AccordionTrigger>
      <AccordionContent>
        {/* 3. A responsive grid layout for the form fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          
          {/* Property Name Field */}
          <FormField
            control={control}
            name="propertyDetails.propertyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Main Street Commercial Building" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Test Field */}
          <FormField
            control={control}
            name="propertyDetails.date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Test</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Address Field */}
          <FormField
            control={control}
            name="propertyDetails.propertyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123 Main St, Anytown, USA" {...field} />
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