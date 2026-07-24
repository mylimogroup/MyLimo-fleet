/**
 * Deterministic EUR money helpers using integer cents to avoid float drift.
 */

export function moneyToCents(amount: number): number {
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid money amount: ${amount}`);
  }
  return Math.round(amount * 100);
}

export function centsToMoney(cents: number): number {
  return cents / 100;
}

export function roundMoney(amount: number): number {
  return centsToMoney(moneyToCents(amount));
}

export function sumMoneyAmounts(
  ...amounts: Array<number | null | undefined>
): number {
  const totalCents = amounts.reduce<number>((sum, amount) => {
    if (amount === null || amount === undefined) return sum;
    return sum + moneyToCents(amount);
  }, 0);
  return centsToMoney(totalCents);
}

export function parseMoneyField(value: number | ""): number | null {
  if (value === "") return null;
  if (!Number.isFinite(value)) return null;
  return roundMoney(value);
}

export const ALLOWED_VAT_RATES = [22, 10, 5, 4, 0] as const;

export type AllowedVatRate = (typeof ALLOWED_VAT_RATES)[number];

export const DEFAULT_VAT_RATE: AllowedVatRate = 22;

export function isAllowedVatRate(value: number): value is AllowedVatRate {
  return (ALLOWED_VAT_RATES as readonly number[]).includes(value);
}

export function parseItalianVatRate(
  value: AllowedVatRate | number | ""
): AllowedVatRate {
  if (value === "" || !Number.isFinite(value)) return DEFAULT_VAT_RATE;
  if (isAllowedVatRate(value)) return value;
  return DEFAULT_VAT_RATE;
}

export function resolveVatRateFromAmounts(
  netAmount: number | null,
  vatAmount: number | null
): AllowedVatRate {
  if (netAmount === null || netAmount === 0 || vatAmount === null) {
    return DEFAULT_VAT_RATE;
  }

  const inferred = Math.round((vatAmount / netAmount) * 10000) / 100;
  const exactMatch = ALLOWED_VAT_RATES.find(
    (rate) => Math.abs(inferred - rate) < 0.01
  );
  if (exactMatch !== undefined) return exactMatch;

  return ALLOWED_VAT_RATES.reduce((closest, rate) =>
    Math.abs(inferred - rate) < Math.abs(inferred - closest) ? rate : closest
  );
}

/**
 * VAT = net × rate / 100, rounded to cents.
 */
export function calculateVatFromNet(
  netAmount: number,
  vatRatePercent: number
): number {
  const netCents = moneyToCents(netAmount);
  const vatCents = Math.round((netCents * vatRatePercent) / 100);
  return centsToMoney(vatCents);
}

export function calculateCostFromNetAndRate(
  netAmount: number,
  vatRatePercent: number
): { netAmount: number; vatAmount: number; totalAmount: number } {
  const net = roundMoney(netAmount);
  const vatAmount = calculateVatFromNet(net, vatRatePercent);
  const totalAmount = sumMoneyAmounts(net, vatAmount);
  return { netAmount: net, vatAmount, totalAmount };
}

/**
 * When net and VAT are both provided, total is always their exact sum.
 * Otherwise total falls back to the explicit total, net alone, or VAT alone.
 */
export function resolveCostTotalAmount(
  netAmount: number | null,
  vatAmount: number | null,
  explicitTotal: number | null
): number {
  if (netAmount !== null && vatAmount !== null) {
    return sumMoneyAmounts(netAmount, vatAmount);
  }
  if (explicitTotal !== null) return explicitTotal;
  if (netAmount !== null) return netAmount;
  if (vatAmount !== null) return vatAmount;
  return 0;
}
