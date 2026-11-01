import { useContext } from 'react';
import { PortalContext } from '../context/portalContextObject';

export function useFieldCatalog() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('useFieldCatalog must be used inside a PortalProvider');
  }
  return {
    catalog: context.fieldCatalog,
    isLoadingCatalog: context.isLoadingCatalog,
  };
}
