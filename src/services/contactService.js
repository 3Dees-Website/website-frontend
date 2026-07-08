import api from './api';

export const contactService = {
  /**
   * Submit the public contact form.
   * Required: fullName, email, subject, message.
   * Optional: phone, orgName.
   */
  submit: async ({ fullName, email, phone, orgName, subject, message }) => {
    const { data } = await api.post('/contact', {
      fullName,
      email,
      phone: phone || undefined,
      orgName: orgName || undefined,
      subject,
      message,
    });
    return data;
  },
};
