/**
 * OperationalInspectorContext
 *
 * Compatibility bridge — re-exports everything from DemoModeContext.
 * All new code should import from DemoModeContext directly.
 */
export {
  useDemoMode as useOperationalInspector,
  DemoModeProvider as OperationalInspectorProvider,
  type AppStage,
} from './DemoModeContext';
