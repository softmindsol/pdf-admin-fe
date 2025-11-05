import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2 } from "lucide-react";

export function AlarmsAndValvesSection({ control }) {
  // Initialize a useFieldArray hook for each dynamic list
  const {
    fields: alarmFields,
    append: appendAlarm,
    remove: removeAlarm,
  } = useFieldArray({
    control,
    name: "alarmsAndValves.alarmValvesOrFlowIndicators",
  });
  const {
    fields: dryPipeFields,
    append: appendDryPipe,
    remove: removeDryPipe,
  } = useFieldArray({ control, name: "alarmsAndValves.dryPipeOperatingTests" });
  const {
    fields: delugeFields,
    append: appendDeluge,
    remove: removeDeluge,
  } = useFieldArray({
    control,
    name: "alarmsAndValves.delugeAndPreActionValves",
  });
  const {
    fields: prvFields,
    append: appendPrv,
    remove: removePrv,
  } = useFieldArray({
    control,
    name: "alarmsAndValves.pressureReducingValveTests",
  });

  return (
    <AccordionItem value="alarms-and-valves">
      <AccordionTrigger className="text-xl font-semibold">
        4. Alarms & Valves
      </AccordionTrigger>
      <AccordionContent asChild>
        <Card className="border-none">
          <CardContent className="pt-6 space-y-8">
            {/* --- Sub-section 1: Alarm Devices --- */}
            <div>
              <h3 className="text-lg font-medium">
                Alarm Devices / Flow Indicators
              </h3>
              <div className="mt-4 space-y-4">
                {alarmFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border p-4 rounded-md relative grid grid-cols-2 md:grid-cols-5 gap-4 items-end"
                  >
                    <FormField
                      control={control}
                      name={`alarmsAndValves.alarmValvesOrFlowIndicators.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Waterflow Switch" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`alarmsAndValves.alarmValvesOrFlowIndicators.${index}.make`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`alarmsAndValves.alarmValvesOrFlowIndicators.${index}.model`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`alarmsAndValves.alarmValvesOrFlowIndicators.${index}.maxOperationTime.min`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Op. Time (Min)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`alarmsAndValves.alarmValvesOrFlowIndicators.${index}.maxOperationTime.sec`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>(Sec)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-3 -right-3"
                      onClick={() => removeAlarm(index)}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() =>
                  appendAlarm({
                    type: "",
                    make: "",
                    model: "",
                    maxOperationTime: { min: null, sec: null },
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Alarm Device
              </Button>
            </div>
            <Separator />

            {/* --- Sub-section 2: Dry Pipe Operating Tests --- */}
            <div>
              <h3 className="text-lg font-medium">Dry Pipe Operating Tests</h3>
              <div className="mt-4 space-y-6">
                {dryPipeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border p-4 rounded-md relative"
                  >
                    <h4 className="font-semibold mb-4">
                      Dry Pipe Valve Test #{index + 1}
                    </h4>
                    {/* Valve Info */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <FormField
                        control={control}
                        name={`alarmsAndValves.dryPipeOperatingTests.${index}.dryValve.make`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dry Valve Make</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.dryPipeOperatingTests.${index}.dryValve.model`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dry Valve Model</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.dryPipeOperatingTests.${index}.dryValve.serialNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dry Valve Serial #</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.dryPipeOperatingTests.${index}.qodValve.make`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>QOD Make</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.dryPipeOperatingTests.${index}.qodValve.model`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>QOD Model</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.dryPipeOperatingTests.${index}.qodValve.serialNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>QOD Serial #</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Tabs for With/Without QOD */}
                    <Tabs defaultValue="without-qod">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="without-qod">
                          Without Q.O.D.
                        </TabsTrigger>
                        <TabsTrigger value="with-qod">With Q.O.D.</TabsTrigger>
                      </TabsList>
                      {/* Without QOD Content */}
                      <TabsContent
                        value="without-qod"
                        className="pt-4 space-y-4"
                      >
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.waterPressureWithoutQOD`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Water Pressure (PSI)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.airPressureWithoutQOD`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Air Pressure (PSI)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.tripPointAirPressureWithoutQOD`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trip Point Air (PSI)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeToTripWithoutQOD.min`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trip Time (Min)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeToTripWithoutQOD.sec`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>(Sec)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeWaterReachedOutletWithoutQOD.min`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Water to Outlet (Min)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeWaterReachedOutletWithoutQOD.sec`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>(Sec)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.alarmOperatedProperlyWithoutQOD`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-full">
                                <div className="space-y-0.5">
                                  <FormLabel>
                                    Alarm Operated Properly?
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      {/* With QOD Content */}
                      <TabsContent value="with-qod" className="pt-4 space-y-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.waterPressureWithQOD`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Water Pressure (PSI)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.airPressureWithQOD`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Air Pressure (PSI)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.tripPointAirPressureWithQOD`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trip Point Air (PSI)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeToTripWithQOD.min`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trip Time (Min)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeToTripWithQOD.sec`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>(Sec)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeWaterReachedOutletWithQOD.min`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Water to Outlet (Min)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.timeWaterReachedOutletWithQOD.sec`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>(Sec)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.dryPipeOperatingTests.${index}.alarmOperatedProperlyWithQOD`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-full">
                                <div className="space-y-0.5">
                                  <FormLabel>
                                    Alarm Operated Properly?
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    <FormField
                      control={control}
                      name={`alarmsAndValves.dryPipeOperatingTests.${index}.explain`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>If no, explain</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Explain if alarm did not operate properly..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-3 -right-3"
                      onClick={() => removeDryPipe(index)}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => appendDryPipe({})}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Dry Pipe Test
              </Button>
            </div>

            <Separator />

            {/* --- Sub-section 3: Deluge & Pre-Action Valves --- */}
            <div>
              <h3 className="text-lg font-medium">
                Deluge & Pre-Action Valves
              </h3>
              <div className="mt-4 space-y-4">
                {delugeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border p-4 rounded-md relative space-y-4"
                  >
                    <h4 className="font-semibold">Valve #{index + 1}</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.make`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.model`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.operation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Operation Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />

                              <SelectContent>
                                <SelectItem value="pneumatic">
                                  Pneumatic
                                </SelectItem>
                                <SelectItem value="electric">
                                  Electric
                                </SelectItem>
                                <SelectItem value="hydraulic">
                                  Hydraulic
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.maxTimeToOperateRelease.min`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Time to Op. (Min)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.maxTimeToOperateRelease.sec`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>(Sec)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Switches */}
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.isPipingSupervised`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>Piping Supervised?</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.isDetectingMediaSupervised`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>Detecting Media Supervised?</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.operatesFromManualOrRemote`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>Operates Manually/Remotely?</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.isAccessibleForTesting`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>Accessible for Testing?</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.doesSupervisionLossAlarmOperate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>
                              Supervision Loss Alarm Operates?
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.delugeAndPreActionValves.${index}.doesValveReleaseOperate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>Valve Release Operates?</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Explanation */}
                    <FormField
                      control={control}
                      name={`alarmsAndValves.delugeAndPreActionValves.${index}.explanation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Explanation</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-3 -right-3"
                      onClick={() => removeDeluge(index)}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => appendDeluge({})}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Deluge/Pre-Action
                Valve
              </Button>
            </div>

            <Separator />

            {/* --- Sub-section 4: Pressure Reducing Valve Tests --- */}
            <div>
              <h3 className="text-lg font-medium">
                Pressure Reducing Valve Tests
              </h3>
              <div className="mt-4 space-y-4">
                {prvFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border p-4 rounded-md relative space-y-4"
                  >
                    <h4 className="font-semibold">PRV Test #{index + 1}</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={control}
                        name={`alarmsAndValves.pressureReducingValveTests.${index}.locationAndFloor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location & Floor</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.pressureReducingValveTests.${index}.makeAndModel`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make & Model</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`alarmsAndValves.pressureReducingValveTests.${index}.setting`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Setting</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 p-2 border rounded-md">
                        <h5 className="font-medium text-sm">
                          Static Pressure (PSI)
                        </h5>
                        <div className="flex gap-4">
                          <FormField
                            control={control}
                            name={`alarmsAndValves.pressureReducingValveTests.${index}.staticPressure.inlet`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Inlet</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.pressureReducingValveTests.${index}.staticPressure.outlet`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Outlet</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 p-2 border rounded-md">
                        <h5 className="font-medium text-sm">
                          Residual Pressure (PSI)
                        </h5>
                        <div className="flex gap-4">
                          <FormField
                            control={control}
                            name={`alarmsAndValves.pressureReducingValveTests.${index}.residualPressure.inlet`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Inlet</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`alarmsAndValves.pressureReducingValveTests.${index}.residualPressure.outlet`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Outlet</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <FormField
                      control={control}
                      name={`alarmsAndValves.pressureReducingValveTests.${index}.flowRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flow Rate (GPM)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-3 -right-3"
                      onClick={() => removePrv(index)}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => appendPrv({})}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add PRV Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
