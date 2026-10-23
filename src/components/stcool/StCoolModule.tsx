import React from 'react';
import { 
  HealthAlertCompanionModule, 
  HealthAlertCompanionModuleProps 
} from '../healthalert/HealthAlertCompanionModule';

export type StCoolModuleProps = HealthAlertCompanionModuleProps;

/**
 * StCoolModule — Consolidated compatibility wrapper delegating to HealthAlertCompanionModule.
 */
export const StCoolModule: React.FC<StCoolModuleProps> = (props) => {
  return <HealthAlertCompanionModule {...props} />;
};

export default StCoolModule;
