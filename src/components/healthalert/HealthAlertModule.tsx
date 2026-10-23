import React from 'react';
import { 
  HealthAlertCompanionModule, 
  HealthAlertCompanionModuleProps 
} from './HealthAlertCompanionModule';

export type HealthAlertModuleProps = HealthAlertCompanionModuleProps;

/**
 * HealthAlertModule — Consolidated compatibility wrapper delegating to HealthAlertCompanionModule.
 */
export const HealthAlertModule: React.FC<HealthAlertModuleProps> = (props) => {
  return <HealthAlertCompanionModule {...props} />;
};

export default HealthAlertModule;
