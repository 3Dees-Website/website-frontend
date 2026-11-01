import { useContext } from 'react';
import { PortalContext } from '../context/portalContextObject';

export function useToast() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('useToast must be used inside a PortalProvider');
  }
  return {
    toasts: context.toasts,
    addToast: context.addToast,
    removeToast: context.removeToast,
  };
}