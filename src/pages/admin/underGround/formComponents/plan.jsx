import React from "react";
import { useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export function PlansAndInstructionsSection({ control }) {
  // Field array for Approving Authorities
  const {
    fields: authorityFields,
    append: appendAuthority,
    remove: removeAuthority,
  } = useFieldArray({
    control,
    name: "plans.acceptedByApprovingAuthorities",
  });

  // --- NEW: Field array for Supplied Buildings ---
  const {
    fields: buildingFields,
    append: appendBuilding,
    remove: removeBuilding,
  } = useFieldArray({
    control,
    name: "suppliesBuildingsNames",
  });

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Plans, Instructions & Supplies</AccordionTrigger>
      <AccordionContent className="space-y-6 p-4">
        
        {/* --- Plans Subsection --- */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Plans</h4>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="plans.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address on Plans</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 456 Oak Avenue, Anytown" {...field} />
                    </FormControl>
                    <FormDescription>
                      The address where the approved plans are located.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <FormLabel>Approving Authorities</FormLabel>
                {authorityFields.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <FormField
                      control={control}
                      name={`plans.acceptedByApprovingAuthorities.${index}`}
                      render={({ field }) => (
                         <Input placeholder={`Authority ${index + 1}`} {...field} />
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAuthority(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                 <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendAuthority("")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Authority
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
               <div className="space-y-4">
                  <FormField
                    control={control}
                    name="plans.installationConformsToAcceptedPlans"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Installation Conforms to Accepted Plans?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="plans.equipmentUsedIsApproved"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Equipment Used is Approved?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
               </div>
               <FormField
                  control={control}
                  name="plans.deviationsExplanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation for Any Deviations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="If the installation deviates from the accepted plans, explain here..."
                          className="resize-y max-h-36"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </div>
        </div>

        <Separator />

        {/* --- Instructions Subsection --- */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Instructions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <FormField
                  control={control}
                  name="instructions.personInChargeInstructed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Person in Charge Instructed?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="instructions.instructionsAndCareChartsLeft"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Instructions & Care Charts Left?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
             </div>
             <div className="space-y-6">
                <FormField
                    control={control}
                    name="instructions.instructionExplanation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instruction Explanation</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the instructions given..." 
                          className="resize-y max-h-36"
                          {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="instructions.chartsExplanation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Charts Explanation</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the charts left on premises..."
                          className="resize-y max-h-36"
                          
                          {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
             </div>
          </div>
        </div>
        
        {/* --- NEW: Supplies Subsection --- */}
        <Separator />
        <div>
          <h4 className="text-lg font-semibold mb-4">Location</h4>
          <div className="space-y-3 md:w-1/2">
            <FormDescription>
              List the names of all buildings supplied by this system.
            </FormDescription>
            {buildingFields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`suppliesBuildingsNames.${index}`}
                  render={({ field }) => (
                    <Input placeholder={`Building Name ${index + 1}`} {...field} />
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeBuilding(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendBuilding("")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </div>
        </div>

      </AccordionContent>
    </AccordionItem>
  );
}