import React from "react";
import { FormField, FormControl, FormLabel, FormItem } from "@/components/ui/form";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function NotesSection({ control }) {
  return (
    <AccordionItem value="notes">
      <AccordionTrigger className="text-xl font-semibold">
        9. Notes
      </AccordionTrigger>
      <AccordionContent asChild>
        <Card className="border-none">
          <CardContent className="pt-6">
            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any internal notes here. This section is for your records and may not be part of the final report."
                      className="min-h-[120px]"
                      {...field}
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