import { API_BASE_URL } from "../config/env.js";
import { storage } from "../lib/storage.js";

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const activeOrg = storage.getActiveOrg();
  const body = { refreshToken };
  if (activeOrg?.id) body.organizationId = activeOrg.id;

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    storage.clearAuth();
    throw new Error(json.message || "Session expired");
  }

  const tokens = json.data;
  storage.setTokens(tokens);
  return tokens.accessToken;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    retry = true,
  } = options;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = storage.getAccessToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (res.status === 401 && auth && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    try {
      await refreshPromise;
      return apiRequest(path, { ...options, retry: false });
    } catch {
      throw new Error(json.message || "Unauthorized");
    }
  }

  if (!res.ok) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }

  return json;
}
