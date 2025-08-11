export const formatCentsToCurrency = (
  cents: number,
  locale: string = "en-US",
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
};
