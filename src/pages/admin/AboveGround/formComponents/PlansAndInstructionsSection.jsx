import React from "react";
// We still use CreatableSelect, as it's designed for this exact use case.
import CreatableSelect from "react-select/creatable";
import {
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// --- DEDICATED COMPONENT FOR THE CREATABLE INPUT ---

// 1. The PREDEFINED_AUTHORITIES constant has been REMOVED.

const AuthorityCreatableInput = ({ field }) => {
  // This logic remains the same: it correctly converts between the form's
  // string array and react-select's object array.
  const value =
    field.value?.map((authority) => ({
      value: authority,
      label: authority,
    })) || [];

  const handleChange = (selectedOptions) => {
    // This logic also remains the same.
    const authoritiesArray = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    field.onChange(authoritiesArray);
  };

  return (
    <CreatableSelect
      isMulti // Allows for multiple tags
      // 2. The `options` prop has been REMOVED.
      // Without options, the component won't show a dropdown,
      // only allowing the user to create new entries.
      value={value}
      onChange={handleChange}
      placeholder="Type an authority and press Enter to add..."
      // Custom message when no options are available (which is always)
      formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
};

// --- MAIN COMPONENT ---
export function PlansAndInstructionsSection({ control, watch }) {
  const conformsToPlans = watch(
    "plansAndInstructions.plans.conformsToAcceptedPlans"
  );
  const personInstructed = watch(
    "plansAndInstructions.instructions.isPersonInChargeInstructed"
  );

  return (
    <AccordionItem value="plans-and-instructions">
      <AccordionTrigger className="text-xl font-semibold">
        2. Plans & Instructions
      </AccordionTrigger>
      <AccordionContent asChild>
        <Card className="border-none">
          <CardContent className="pt-6 space-y-6">
            <h3 className="text-lg font-medium">Plans</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="plansAndInstructions.plans.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location of Plans</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., On-site office" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="plansAndInstructions.plans.acceptedByAuthorities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authorities Accepting Plans</FormLabel>
                      <FormControl>
                        {/* We use our updated component here */}
                        <AuthorityCreatableInput field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="plansAndInstructions.plans.equipmentIsApproved"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel>Equipment is Approved/Listed</FormLabel>
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
                  name="plansAndInstructions.plans.conformsToAcceptedPlans"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel>Conforms to Accepted Plans</FormLabel>
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

            {conformsToPlans === false && (
              <FormField
                control={control}
                name="plansAndInstructions.plans.deviationsExplanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deviations Explanation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain any deviations from the accepted plans..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator />
            
            {/* ... The rest of the component remains unchanged ... */}
            <h3 className="text-lg font-medium">Instructions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={control}
                name="plansAndInstructions.instructions.hasSystemComponentsInstructions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Component Instructions Provided</FormLabel>
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
                name="plansAndInstructions.instructions.hasCareAndMaintenanceInstructions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>
                      Care/Maintenance Instructions Provided
                    </FormLabel>
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
                name="plansAndInstructions.instructions.hasNFPA25"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Copy of NFPA 25 Provided</FormLabel>
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
            <FormField
              control={control}
              name="plansAndInstructions.instructions.isPersonInChargeInstructed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel>
                    Person in Charge Instructed on System Operation
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {personInstructed === false && (
              <FormField
                control={control}
                name="plansAndInstructions.instructions.instructionExplanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruction Explanation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why the person in charge was not instructed..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}