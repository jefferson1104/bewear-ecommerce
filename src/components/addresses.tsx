"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumberFormatBase, PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { isValidUSZip, US_STATES, validatePhone } from "@/utils/address-utils";

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
    zipCode: z.string().trim().min(5, "ZIP code is required"),
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
    // Phone validation by country
    const phoneError = validatePhone(values.country, values.phone);
    if (phoneError) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: phoneError,
      });
    }

    // ZIP validation (US only)
    if (values.country === "US" && !isValidUSZip(values.zipCode)) {
      ctx.addIssue({
        code: "custom",
        path: ["zipCode"],
        message: "Invalid ZIP code. Use 12345 or 12345-6789",
      });
    }
  });

type AddressFormValues = z.input<typeof addressFormSchema>;

export function Addresses() {
  // Hooks
  const createShippingAddress = useCreateShippingAddress();
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
    createShippingAddress.mutate(
      {
        email: formData.email,
        fullName: formData.fullName,
        // Action currently supports US and BR; fallback to US if other
        country: (formData.country ?? "US") === "BR" ? "BR" : "US",
        phone: formData.phone,
        zipCode: formData.zipCode,
        address: formData.address,
        number: formData.number,
        complement: formData.complement ?? undefined,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      },
      {
        onSuccess: () => {
          toast.success("New address added successfully");
        },
        onError: (error) => {
          console.error("Error while adding new address", error);
          toast.error("Error while adding new address");
        },
      },
    );
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

        {/* Add new address form */}
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
                          className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
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
                          className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <NumberFormatBase
                            className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
                            customInput={Input}
                            value={field.value}
                            onValueChange={(vals) =>
                              field.onChange(vals.formattedValue)
                            }
                            format={(val) => {
                              const digits = (val || "")
                                .replace(/\D/g, "")
                                .slice(0, 9);
                              if (digits.length <= 5) return digits;
                              return `${digits.slice(0, 5)}-${digits.slice(5)}`;
                            }}
                            placeholder="ZIP Code"
                            inputMode="numeric"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
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
                            className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
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
                            className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
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
                            className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
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
                            className="text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm"
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full overflow-hidden rounded-md border px-3 py-1 text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {US_STATES.map((state) => (
                                  <SelectItem
                                    key={state.value}
                                    value={state.value}
                                  >
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
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
