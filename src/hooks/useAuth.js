import { useContext } from 'react';
import { PortalContext } from '../context/PortalContext';

export function useAuth() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('useAuth must be used inside a PortalProvider');
  }
  return {
    currentUser: context.currentUser,
    token: context.token,
    pendingAuthToken: context.pendingAuthToken,
    // Step 1: returns { pendingToken, destination }
    login: context.login,
    // Step 2: exchanges OTP for real tokens, returns true
    verifyOtp: context.verifyOtp,
    logout: context.logout,
    admins: context.admins,
    registerAdmin: context.registerAdmin,
    toggleAdminSuspension: context.toggleAdminSuspension,
    resetAdminPass: context.resetAdminPass,
    removeAdmin: context.removeAdmin,
  };
}
