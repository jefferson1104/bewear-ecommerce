"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import z from "zod";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

const addressFormSchema = z
  .object({
    email: z.email("Invalid email address").trim().min(1, "Email is required"),
    fullName: z.string().trim().min(1, "Full name is required"),
    // Country and phone will be validated together
    country: z.enum(["US", "CA", "GB", "BR", "PT"]).default("US"),
    phone: z.string().trim().min(1, "Phone is required"),
    zipCode: z
      .string()
      .trim()
      .min(5, "ZIP code is required")
      .max(10, "ZIP code is too long"),
    address: z.string().trim().min(1, "Address is required"),
    number: z.string().trim().min(1, "Number is required"),
    complement: z.string().trim().optional(),
    neighborhood: z.string().trim().min(1, "Neighborhood is required"),
    city: z.string().trim().min(1, "City is required"),
    state: z
      .string()
      .trim()
      .min(2, "State is required")
      .max(2, "State must be 2 characters"),
  })
  .superRefine((values, ctx) => {
    // Validate phone per selected country using digits-only string
    const digits = values.phone.replace(/\D/g, "");

    const rules: Record<string, { regex: RegExp; message: string }> = {
      US: {
        // +1 (AAA) NNN-NNNN => 1 + 10
        regex: /^1\d{10}$/,
        message: "Invalid US phone. Expected +1 (AAA) NNN-NNNN",
      },
      BR: {
        // +55 (AA) #####-#### => 55 + 11
        regex: /^55\d{11}$/,
        message: "Invalid BR phone. Expected +55 (AA) #####-####",
      },
    };

    const rule = rules[values.country];
    if (!rule.regex.test(digits)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: rule.message,
      });
    }
  });

type AddressFormValues = z.input<typeof addressFormSchema>;

export function Address() {
  // Hooks
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "US",
      phone: "",
    },
  });

  // States
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  // Methods
  const onSubmit = async (formData: AddressFormValues) => {
    console.log("Form submitted:", formData);
    // TODO: Implement form submission logic
  };

  // Renders
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Identification</CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Add New Address</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {selectedAddress && <Separator className="mt-8 mb-8" />}

        {selectedAddress === "add_new" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold">Add New Address</h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Country and Phone */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-56">
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full overflow-hidden rounded-md border px-3 py-1 text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="US">
                                  United States
                                </SelectItem>
                                <SelectItem value="BR">Brazil</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => {
                      const watchedCountry = form.watch("country") ?? "US";
                      const countryToMask = {
                        US: "+1 (###) ###-####",
                        BR: "+55 (##) #####-####",
                      } as const;

                      const format =
                        countryToMask[
                          watchedCountry as keyof typeof countryToMask
                        ];

                      return (
                        <FormItem className="w-full">
                          <FormControl>
                            <PatternFormat
                              className="text-xs md:text-sm"
                              customInput={Input}
                              format={format}
                              allowEmptyFormatting
                              placeholder={format}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="placeholder:text-xs md:placeholder:text-sm"
                          type="email"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="placeholder:text-xs md:placeholder:text-sm"
                          placeholder="Full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ZIP Code */}
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PatternFormat
                          className="placeholder:text-xs md:placeholder:text-sm"
                          customInput={Input}
                          format="#####-####"
                          placeholder="ZIP Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="placeholder:text-xs md:placeholder:text-sm"
                          placeholder="Address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Number and Complement */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="placeholder:text-xs md:placeholder:text-sm"
                            placeholder="Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="placeholder:text-xs md:placeholder:text-sm"
                            placeholder="Complement"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Neighborhood, City, State */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="placeholder:text-xs md:placeholder:text-sm"
                            placeholder="Neighborhood"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="placeholder:text-xs md:placeholder:text-sm"
                            placeholder="City"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="placeholder:text-xs md:placeholder:text-sm"
                            placeholder="State"
                            maxLength={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  Continue with Payment
                </Button>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
