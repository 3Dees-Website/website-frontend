import api from './api';

export const authService = {
  /**
   * Step 1 of login: validate credentials and trigger OTP email.
   * Returns { pendingToken, destination } on success.
   */
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  /**
   * Step 2 of login: exchange OTP for access + refresh tokens.
   * Returns { accessToken, refreshToken, user } on success.
   */
  verifyOtp: async (pendingToken, otpCode) => {
    const { data } = await api.post('/auth/verify-otp', { pendingToken, otpCode });
    return data.data;
  },

  /** Rotate tokens. Returns { accessToken, refreshToken }. */
  refresh: async (refreshToken) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data;
  },

  /** Revoke the refresh token server-side. Always resolves. */
  logout: async (refreshToken) => {
    await api.post('/auth/logout', { refreshToken });
  },
};
