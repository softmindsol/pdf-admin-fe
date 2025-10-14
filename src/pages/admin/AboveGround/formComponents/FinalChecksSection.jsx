import React from "react";
import { FormField, FormControl, FormLabel, FormItem } from "@/components/ui/form";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function FinalChecksSection({ control }) {
  // Watch the value of the nameplate switch to conditionally render the explanation field

  return (
    <AccordionItem value="final-checks">
      <AccordionTrigger className="text-xl font-semibold">
        7. Final Checks
      </AccordionTrigger>
      <AccordionContent asChild>
        <Card className="border-none">
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={control}
              name="finalChecks.hasHydraulicDataNameplate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Hydraulic Data Nameplate Provided?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Conditionally rendered field */}
              <FormField
                control={control}
                name="finalChecks.nameplateExplanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation (If Nameplate Not Provided)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why the hydraulic data nameplate was not provided..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            <FormField
              control={control}
              name="finalChecks.areCapsAndStrapsRemoved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>All Control Valve Caps & Straps Removed?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}