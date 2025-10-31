import React from "react";
import { FormField, FormControl, FormLabel, FormItem } from "@/components/ui/form";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";

// A reusable component for the signature block to keep the code DRY
const SignatureBlock = ({ control, name, title }) => {
  const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "yyyy-MM-dd");
  } catch {
    return "";
  }
};

// ... inside your component where the Input is rendered ...

// Calculate today's date in 'YYYY-MM-DD' format once
const todayFormatted = formatDateForInput(new Date().toISOString());
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h4 className="font-semibold text-center text-lg mb-4">{title}</h4>
      <FormField
        control={control}
        name={`${name}.signature`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Signature (Typed Name)</FormLabel>
            <FormControl>
              <Input placeholder="Type full name to sign" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Printed Name</FormLabel>
            <FormControl>
              <Input placeholder="Printed full name" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Official title" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.date`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              {/* Ensure value is not null/undefined for the date input */}
              <Input type="date"  
                max={todayFormatted} // Use the formatted today's date for the max attribute
              {...field} value={field.value || ""} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export function RemarksAndSignaturesSection({ control }) {
  return (
    <AccordionItem value="remarks-and-signatures">
      <AccordionTrigger className="text-xl font-semibold">
        8. Remarks & Signatures
      </AccordionTrigger>
      <AccordionContent asChild>
        <Card className="border-none">
          <CardContent className="pt-6 space-y-8">
            {/* Remarks Textarea */}
            <FormField
              control={control}
              name="remarksAndSignatures.remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional comments or remarks here..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sprinkler Contractor Name */}
              <FormField
                control={control}
                name="remarksAndSignatures.sprinklerContractorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprinkler Contractor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contracting Company Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Date Left in Service */}
              <FormField
                control={control}
                name="remarksAndSignatures.dateLeftInService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date System Left in Service</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Signature Blocks Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <SignatureBlock
                control={control}
                name="remarksAndSignatures.fireMarshalOrAHJ"
                title="Fire Marshal or Authority Having Jurisdiction (AHJ)"
              />
              <SignatureBlock
                control={control}
                name="remarksAndSignatures.sprinklerContractor"
                title="Sprinkler Contractor Representative"
              />
            </div>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}