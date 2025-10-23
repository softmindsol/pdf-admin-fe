import React from "react";
import { FormField, FormControl, FormLabel, FormItem } from "@/components/ui/form";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BackflowTestSection } from "./backflow";

export function TestingSection({ control }) {
  // Watch the value of 'doesEquipmentOperateProperly' to conditionally render the reason field

  return (
    <AccordionItem value="testing">
      <AccordionTrigger className="text-xl font-semibold">
        5. Testing
      </AccordionTrigger>
      <AccordionContent asChild>
        <Card className="border-none">
          <CardContent className="pt-6 space-y-8">
                        <BackflowTestSection control={control} />

            {/* --- Sub-section 1: Hydrostatic Test --- */}
            <div>
              <h3 className="text-lg font-medium">Hydrostatic Test</h3>
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name="testing.hydrostaticTest.pressurePsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pressure (PSI)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="testing.hydrostaticTest.pressureBar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pressure (Bar)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="testing.hydrostaticTest.durationHrs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Hours)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* --- Sub-section 2: General Tests & Certifications --- */}
            <div className="space-y-4">
               <FormField
                  control={control}
                  name="testing.isDryPipingPneumaticallyTested"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel>Dry Piping Pneumatically Tested?</FormLabel>
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
                  name="testing.doesEquipmentOperateProperly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel>Equipment Operates Properly?</FormLabel>
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
                      name="testing.improperOperationReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Improper Operation</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Explain why the equipment did not operate properly..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                 <FormField
                  control={control}
                  name="testing.noCorrosiveChemicalsCertification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel>Certification: No Corrosive Chemicals Used?</FormLabel>
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
            
            <Separator />

            {/* --- Sub-section 3: Drain Test --- */}
            <div>
                <h3 className="text-lg font-medium">Drain Test</h3>
                 <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-2 border rounded-md">
                        <h5 className="font-medium text-sm">Gauge Reading</h5>
                        <div className="flex gap-4">
                           <FormField
                              control={control}
                              name="testing.drainTest.gaugeReadingPsi"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>PSI</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name="testing.drainTest.gaugeReadingBar"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Bar</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                        </div>
                    </div>
                     <div className="space-y-2 p-2 border rounded-md">
                        <h5 className="font-medium text-sm">Residual Pressure</h5>
                        <div className="flex gap-4">
                           <FormField
                              control={control}
                              name="testing.drainTest.residualPressurePsi"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>PSI</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name="testing.drainTest.residualPressureBar"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Bar</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                        </div>
                    </div>
                 </div>
            </div>

            <Separator />

            {/* --- Sub-section 4: Underground Piping --- */}
            <div>
              <h3 className="text-lg font-medium">Underground Piping</h3>
              <div className="mt-4 space-y-4">
                 <FormField
                  control={control}
                  name="testing.undergroundPiping.isVerifiedByCertificate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel>Verified by Certificate?</FormLabel>
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
                  name="testing.undergroundPiping.wasFlushedByInstaller"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel>Flushed by Installer/Contractor?</FormLabel>
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
                  name="testing.undergroundPiping.explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />

            {/* --- Sub-section 5: Powder Driven Fasteners --- */}
             <div>
              <h3 className="text-lg font-medium">Powder Driven Fasteners</h3>
              <div className="mt-4 space-y-4">
                 <FormField
                  control={control}
                  name="testing.powderDrivenFasteners.isTestingSatisfactory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel>Testing Satisfactory?</FormLabel>
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
                  name="testing.powderDrivenFasteners.explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

             <Separator />
            
            {/* --- Sub-section 6: Blank Testing Gaskets --- */}
            <div>
              <h3 className="text-lg font-medium">Blank Testing Gaskets</h3>
              <div className="mt-4 grid md:grid-cols-3 gap-4 items-end">
                <FormField
                  control={control}
                  name="testing.blankTestingGaskets.numberUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number Used</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={control}
                  name="testing.blankTestingGaskets.locations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locations</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="testing.blankTestingGaskets.numberRemoved"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number Removed</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}