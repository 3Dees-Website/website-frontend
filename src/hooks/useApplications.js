import { useContext } from 'react';
import { PortalContext } from '../context/portalContextObject';

export function useApplications() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('useApplications must be used inside a PortalProvider');
  }
  return {
    // Returns referenceId string; throws on API error.
    applyToJob: context.applyToJob,
  };
}
