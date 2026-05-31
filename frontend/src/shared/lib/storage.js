const KEYS = {
  ACCESS_TOKEN: "pmp_access_token",
  REFRESH_TOKEN: "pmp_refresh_token",
  ACTIVE_ORG: "pmp_active_org",
};

export const storage = {
  getAccessToken: () => localStorage.getItem(KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => localStorage.setItem(KEYS.ACCESS_TOKEN, token),
  getRefreshToken: () => localStorage.getItem(KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => localStorage.setItem(KEYS.REFRESH_TOKEN, token),
  getActiveOrg: () => {
    const raw = localStorage.getItem(KEYS.ACTIVE_ORG);
    return raw ? JSON.parse(raw) : null;
  },
  setActiveOrg: (org) =>
    localStorage.setItem(KEYS.ACTIVE_ORG, JSON.stringify(org)),
  clearAuth: () => {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.ACTIVE_ORG);
  },
  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) storage.setAccessToken(accessToken);
    if (refreshToken) storage.setRefreshToken(refreshToken);
  },
};
