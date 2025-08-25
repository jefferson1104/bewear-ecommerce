export type SupportedPhoneCountry = "US" | "BR";

export function extractDigits(value: string): string {
  return (value ?? "").replace(/\D/g, "");
}

export function validatePhone(
  country: string,
  rawPhone: string,
): string | null {
  const digits = extractDigits(rawPhone);

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

  const rule = rules[country];
  if (!rule) return null; // If country not supported, skip validation here

  return rule.regex.test(digits) ? null : rule.message;
}

export function isValidUSZip(zip: string): boolean {
  // Accept 5 digits or ZIP+4
  return /^\d{5}(-\d{4})?$/.test(zip);
}

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];
