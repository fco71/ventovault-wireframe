export interface DemoFeatureFlags {
  enableDeterministicLatency: boolean;
  enableQuoteExpiry: boolean;
  enableTransferMachineAutoProgress: boolean;
  enableSignalModeDefault: boolean;
  enableReceiveExactForL30: boolean;
  enableCsvExport: boolean;
  enableDebugLogs: boolean;
  enableAuthDemoFallback: boolean;
}

function getBooleanEnvFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (typeof value !== 'string') {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

export const featureFlags: DemoFeatureFlags = {
  enableDeterministicLatency: true,
  enableQuoteExpiry: true,
  enableTransferMachineAutoProgress: true,
  enableSignalModeDefault: false,
  enableReceiveExactForL30: true,
  enableCsvExport: true,
  enableDebugLogs: false,
  enableAuthDemoFallback: getBooleanEnvFlag(import.meta.env.VITE_ENABLE_AUTH_DEMO_FALLBACK, false),
};
