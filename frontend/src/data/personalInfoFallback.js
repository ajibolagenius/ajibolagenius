/**
 * Safe fallback when personal_info is unavailable and VITE_USE_MOCK_FALLBACK is off.
 * Shapes mirror `personal_info` / mock for optional chaining in UI.
 */
export const minimalPersonalInfoFallback = {
  name: '',
  tagline: '',
  tagline_suffix: '',
  taglineSuffix: '',
  description: '',
  role: '',
  email: '',
  location: '',
  availability: '',
  social: {},
  locale: 'en',
};
