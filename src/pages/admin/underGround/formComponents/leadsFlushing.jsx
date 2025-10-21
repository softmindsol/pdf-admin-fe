import React from "react";

// 1. Import necessary components
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator"; // For visual separation

// 2. The component accepts `control` from the main useForm hook
export function LeadsFlushingTests({ control }) {
  return (
    <AccordionItem value="item-4b"> {/* Use a unique value */}
      <AccordionTrigger>Lead-ins Flushing Tests</AccordionTrigger>
      <AccordionContent className="p-4 space-y-6">

        {/* --- Lead-ins Flushing Tests Subsection --- */}
        <div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <FormField
                  control={control}
                  name="leadsflushingTests.undergroundPipingStandard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead-ins Flushing Standard</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., NFPA 13, Section X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="leadsflushingTests.undergroundPipingStandardConform"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Does lead-in flushing conform to standard?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="leadsflushingTests.undergroundPipingStandardExplanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead-ins Flushing Explanation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="If lead-in flushing does not conform, explain here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="leadsflushingTests.flushingFlowObtained"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flushing Flow Obtained From</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a source..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Public water">Public water</SelectItem>
                        <SelectItem value="Tank or reservoir">Tank or reservoir</SelectItem>
                        <SelectItem value="Fire pump">Fire pump</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="leadsflushingTests.openingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Opening</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an opening type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Y connection to flange and spigot">
                          Y connection to flange and spigot
                        </SelectItem>
                        <SelectItem value="Open pipe">Open pipe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
      </AccordionContent>
    </AccordionItem>
  );
}