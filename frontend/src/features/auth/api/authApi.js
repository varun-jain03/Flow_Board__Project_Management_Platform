import { apiRequest } from "../../../shared/api/client.js";

export const authApi = {
  register: (data) =>
    apiRequest("/auth/register", { method: "POST", body: data, auth: false }),
  login: (data) =>
    apiRequest("/auth/login", { method: "POST", body: data, auth: false }),
  refresh: (data) =>
    apiRequest("/auth/refresh", { method: "POST", body: data, auth: false }),
  logout: (data) =>
    apiRequest("/auth/logout", { method: "POST", body: data, auth: false }),
};
