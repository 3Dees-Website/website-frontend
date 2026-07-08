import api from './api';

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.created_at,
  lastLogin: user.last_login,
});

export const usersService = {
  /** List all admin users. Requires superadmin role. */
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data.data.map(normalizeUser);
  },

  /** Create a new admin user. role must be 'admin' or 'superadmin'. */
  createUser: async ({ name, email, password, role }) => {
    const { data } = await api.post('/admin/users', { name, email, password, role });
    return normalizeUser(data.data);
  },

  /** Toggle a user's status between Active and Suspended. Cannot self-suspend. */
  toggleStatus: async (id) => {
    const { data } = await api.patch(`/admin/users/${id}/status`);
    return normalizeUser(data.data);
  },

  /** Reset a user's password. Forces re-login by revoking their refresh tokens. */
  resetPassword: async (id, newPassword) => {
    const { data } = await api.patch(`/admin/users/${id}/password`, { newPassword });
    return data;
  },

  /** Permanently delete a user. Cannot delete own account. */
  deleteUser: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },
};
