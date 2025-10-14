import React from "react";
import { FormField, FormControl, FormLabel, FormItem } from "@/components/ui/form";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function WeldingAndCutoutsSection({ control, watch }) {
  // Watch the value of the main switch to conditionally render the sub-sections
  const isWeldingPiping = watch("weldingAndCutouts.isWeldingPiping");

  return (
    <AccordionItem value="welding-and-cutouts">
      <AccordionTrigger className="text-xl font-semibold">
        6. Welding & Cutouts
      </AccordionTrigger>
      <AccordionContent asChild>
        <Card className="border-none">
          <CardContent className="pt-6 space-y-6">
            <FormField
              control={control}
              name="weldingAndCutouts.isWeldingPiping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Is Welding Piping Involved?</FormLabel>
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

            {/* Conditionally render the details only if welding is involved */}
            {isWeldingPiping && (
              <div className="space-y-6 pl-4 border-l-2 ml-1">
                {/* --- Sub-section 1: Certifications --- */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Certifications</h3>
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="weldingAndCutouts.certifications.awsB21Compliant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <FormLabel>Welding conforms to AWS B2.1?</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="weldingAndCutouts.certifications.weldersQualified"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <FormLabel>Welders/Welding Operators Qualified?</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={control}
                      name="weldingAndCutouts.certifications.qualityControlProcedureCompliant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <FormLabel>Welding procedure & quality control compliant?</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />

                {/* --- Sub-section 2: Cutouts --- */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Cutouts (Welded Coupons)</h3>
                     <FormField
                      control={control}
                      name="weldingAndCutouts.cutouts.hasRetrievalControl"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <FormLabel>Pieces retrieved or controlled?</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}