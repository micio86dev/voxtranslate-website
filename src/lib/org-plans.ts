/**
 * Business / Enterprise plan pricing.
 *
 * Read from a COMMITTED snapshot (`src/data/org-plans.json`) produced by
 * `node scripts/refresh-org-plans.mjs`, exactly like `engines.ts` and for the same
 * reason: the marketing build must not depend on reaching the production API through
 * the Cloudflare WAF (runbook 111).
 *
 * WHY THIS MODULE EXISTS AT ALL
 * -----------------------------
 * These four figures used to be typed into all five `src/i18n/*.json` files. Five
 * hand-maintained copies of a number whose only source of truth is a Stripe Price
 * object — and nothing compared them. When the copy was switched from EUR to USD ahead
 * of the Stripe prices themselves, the site advertised $49/$199 against Prices
 * denominated in EUR for two months. No test failed, because no test could: the site
 * was internally consistent and externally wrong.
 *
 * The i18n files now hold what they should always have held — plan names, feature
 * bullets, and the words around the number. The number comes from here.
 */
import snapshot from '../data/org-plans.json';

export type OrgPlanName = 'business' | 'enterprise';
export type BillingInterval = 'month' | 'year';

export interface OrgPlan {
  plan: OrgPlanName;
  interval: BillingInterval;
  /** Minor units, as Stripe stores them. Never render this directly. */
  unit_amount: number;
  /** ISO 4217, lower-case, as Stripe returns it. */
  currency: string;
  active: boolean;
}

export const ORG_PLANS = snapshot.plans as OrgPlan[];

/** When the snapshot was taken. Rendered where the page needs to be honest about age. */
export const PLANS_FETCHED_AT = snapshot.fetchedAt;

export function findPlan(plan: OrgPlanName, interval: BillingInterval): OrgPlan | undefined {
  return ORG_PLANS.find((p) => p.plan === plan && p.interval === interval);
}

/**
 * Format a plan price for display.
 *
 * `Intl.NumberFormat` rather than a hand-built `$${n}` template, because the number of
 * decimal places is a property of the CURRENCY, not a style choice — and this file now
 * renders whatever currency Stripe reports rather than a currency we assumed. Whole
 * amounts drop the decimals, since "$49" is what a pricing page says and "$49.00" is
 * what an invoice says.
 */
export function formatPlanPrice(plan: OrgPlan, locale = 'en'): string {
  const amount = plan.unit_amount / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: plan.currency.toUpperCase(),
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * How many months of an annual plan are free, derived rather than asserted.
 *
 * The pricing page has always claimed "2 months free". That is true only while the
 * annual price equals ten monthly payments — a relationship between two Stripe Prices
 * that nothing enforced. Computing it means the claim tracks the prices instead of
 * outliving them. Returns `null` when the two are not a clean whole-month saving, so a
 * caller renders nothing rather than a wrong number.
 */
export function monthsFreeOnAnnual(plan: OrgPlanName): number | null {
  const monthly = findPlan(plan, 'month');
  const annual = findPlan(plan, 'year');
  if (!monthly || !annual || monthly.currency !== annual.currency) return null;
  if (monthly.unit_amount <= 0) return null;
  const months = annual.unit_amount / monthly.unit_amount;
  const free = 12 - months;
  return Number.isInteger(free) && free > 0 ? free : null;
}
