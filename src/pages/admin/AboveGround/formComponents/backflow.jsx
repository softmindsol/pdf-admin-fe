// src/components/forms/above-ground-test/formComponents/BackflowTestSection.jsx

import React from "react";
import {
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// This component will be part of the larger "Testing" accordion
export function BackflowTestSection({ control }) {
  return (
    <>
      <Separator className="my-6" />
      <div className="space-y-6">
        <h4 className="text-md font-medium">Backflow Device Forward Flow Test</h4>
        <FormField
          control={control}
          name="testing.backflowTest.meansUsed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indicate means used for forward flow test</FormLabel>
              <FormControl>
                <Input placeholder="Describe means used..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="testing.backflowTest.wasFlowDemandCreated"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When test was opened, was system flow demand created?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}