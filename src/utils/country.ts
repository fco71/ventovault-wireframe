const COUNTRY_CODE_MAP: Record<string, string> = {
  'united states': 'US',
  'dominican republic': 'DO',
  mexico: 'MX',
  guatemala: 'GT',
  colombia: 'CO',
  brazil: 'BR',
  canada: 'CA',
  spain: 'ES',
};

export function toCountryCode(country?: string | null): string {
  if (!country) {
    return 'GL';
  }

  const normalized = country.trim().toLowerCase();
  if (!normalized) {
    return 'GL';
  }

  const mapped = COUNTRY_CODE_MAP[normalized];
  if (mapped) {
    return mapped;
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0] || '')
    .join('')
    .toUpperCase();
}
