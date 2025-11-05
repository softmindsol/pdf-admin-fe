import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export function RemarksAndSignatures({ control }) {
  return (
    <AccordionItem value="item-8">
      <AccordionTrigger>Remarks, Signatures & Notes</AccordionTrigger>
      <AccordionContent className="p-4 space-y-6">
        {/* --- Remarks Subsection --- */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Remarks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="remarks.nameOfInstallingContractor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Installing Contractor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Reliable Fire Protection Inc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="remarks.dateLeftInService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date System Left in Service</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* --- Signatures Subsection --- */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Signatures</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Owner Signature */}
            <div className="space-y-4">
              <h5 className="font-medium">Property Owner Representative</h5>
              <FormField 
                control={control}
                name="signatures.forPropertyOwner.signed"
                render={({ field }) => (
                  <FormItem className={'hidden'}>
                    <FormLabel>Signed By (Name)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="signatures.forPropertyOwner.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Facility Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="signatures.forPropertyOwner.date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Signed</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Installing Contractor Signature */}
            <div className="space-y-4">
              <h5 className="font-medium">
                Installing Contractor Representative
              </h5>
              <FormField
                control={control}
                name="signatures.forInstallingContractor.signed"
                render={({ field }) => (
                  <FormItem className={'hidden'} >
                    <FormLabel>Signed By (Name)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="signatures.forInstallingContractor.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lead Technician" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="signatures.forInstallingContractor.date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Signed</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* --- Additional Notes Subsection --- */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Additional Notes</h4>
          <FormField
            control={control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any other relevant notes or comments about the test here..."
                    className="min-h-[100px]"
                    {...field}
                  />
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
