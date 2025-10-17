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
import { Separator } from "@/components/ui/separator";

// 2. The component accepts `control` from the main useForm hook
export function PipesAndJointsSection({ control }) {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Underground Pipes & Joints</AccordionTrigger>
      <AccordionContent className="p-4 space-y-6">
        
        {/* --- General Pipe & Joint Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="undergroundPipesAndJoints.pipeTypesAndClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pipe Types and Class</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ductile Iron, Class 52" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="undergroundPipesAndJoints.typeJoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Joint</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mechanical Joint" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* --- Pipe Standards --- */}
        <div>
          <h4 className="text-md font-semibold mb-4">Pipe Standards</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <FormField
                control={control}
                name="undergroundPipesAndJoints.pipeStandard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applicable Pipe Standard</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AWWA C151" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="undergroundPipesAndJoints.pipeStandardConform"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Does pipe conform to standard?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {/* This section has no explanation field, but the layout is ready for others */}
          </div>
        </div>
        
        <Separator />

        {/* --- Fitting Standards --- */}
        <div>
          <h4 className="text-md font-semibold mb-4">Fitting Standards</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <FormField
                control={control}
                name="undergroundPipesAndJoints.fittingStandard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applicable Fitting Standard</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AWWA C110" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="undergroundPipesAndJoints.fittingStandardConform"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Do fittings conform to standard?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={control}
                name="undergroundPipesAndJoints.fittingStandardExplanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitting Standard Explanation</FormLabel>
                    <FormControl>
                      <Textarea placeholder="If fittings do not conform, explain here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </div>

        <Separator />

        {/* --- Joints Standards --- */}
        <div>
          <h4 className="text-md font-semibold mb-4">Joints Standards</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <FormField
                control={control}
                name="undergroundPipesAndJoints.jointsStandard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applicable Joints Standard</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AWWA C111" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="undergroundPipesAndJoints.jointsStandardConform"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Do joints conform to standard?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={control}
                name="undergroundPipesAndJoints.jointsStandardExplanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joints Standard Explanation</FormLabel>
                    <FormControl>
                      <Textarea placeholder="If joints do not conform, explain here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </div>

      </AccordionContent>
    </AccordionItem>
  );
}