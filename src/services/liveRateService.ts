/**
 * Live Exchange Rate Service
 *
 * Fetches real mid-market rates from the @fawazahmed0/currency-api,
 * a free public API served via jsDelivr CDN — no API key required.
 *
 * API docs: https://github.com/fawazahmed0/exchange-api
 * Rates update once daily from the ECB + other public feeds.
 *
 * Caches results for 10 minutes so multiple quote fetches in
 * a session don't hammer the API.
 */

const API_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

// Fallback rates — used if the network fetch fails.
// Updated reference point: Q1 2025.
const FALLBACK_RATES: Record<string, number> = {
  dop: 60.15,   // USD → Dominican Peso
  mxn: 20.10,   // USD → Mexican Peso
  gtq: 7.76,    // USD → Guatemalan Quetzal
  hnl: 25.30,   // USD → Honduran Lempira
};

interface RateCache {
  rates: Record<string, number>;
  fetchedAt: number;
}

let cache: RateCache | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function getLiveRates(): Promise<Record<string, number>> {
  // Return cached rates if still fresh
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.rates;
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // API returns { date: "...", usd: { dop: 60.15, mxn: 20.10, ... } }
    const rates: Record<string, number> = data.usd ?? {};

    cache = { rates, fetchedAt: Date.now() };
    return rates;
  } catch {
    // Network unavailable or API down — use fallback silently
    console.warn('[liveRateService] Could not fetch live rates, using fallback.');
    return FALLBACK_RATES;
  }
}

export async function getRateForCurrency(currencyCode: string): Promise<number> {
  const rates = await getLiveRates();
  const key = currencyCode.toLowerCase();
  return rates[key] ?? FALLBACK_RATES[key] ?? 1;
}
