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

export const featureFlags: DemoFeatureFlags = {
  enableDeterministicLatency: true,
  enableQuoteExpiry: true,
  enableTransferMachineAutoProgress: true,
  enableSignalModeDefault: false,
  enableReceiveExactForL30: true,
  enableCsvExport: true,
  enableDebugLogs: false,
  enableAuthDemoFallback: true,
};
