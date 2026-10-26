import React from 'react';
import { 
  HealthAlertCompanionModule, 
  HealthAlertCompanionModuleProps 
} from './HealthAlertCompanionModule';

export type HealthAlertMiniModuleProps = HealthAlertCompanionModuleProps;

/**
 * HealthAlertMiniModule — Primary implementation component for Health Alert Mini.
 * Re-exports the clinical triage, anticipatory warning sensing, SBAR handoff, and FHIR engine.
 */
export const HealthAlertMiniModule: React.FC<HealthAlertMiniModuleProps> = (props) => {
  return <HealthAlertCompanionModule {...props} />;
};

export default HealthAlertMiniModule;
