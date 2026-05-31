import { apiRequest } from "../../../shared/api/client.js";

export const membersApi = {
  list: () => apiRequest("/members"),
  invite: (data) =>
    apiRequest("/members/invite", { method: "POST", body: data }),
  updateRole: (data) =>
    apiRequest("/members/role", { method: "PATCH", body: data }),
  transferOwnership: (userId) =>
    apiRequest("/members/transfer-ownership", {
      method: "POST",
      body: { userId },
    }),
  remove: (userId) => apiRequest(`/members/${userId}`, { method: "DELETE" }),
};
