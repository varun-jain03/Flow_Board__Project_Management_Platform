import { apiRequest } from "../../../shared/api/client.js";

export const orgApi = {
  create: (data) =>
    apiRequest("/organizations", { method: "POST", body: data }),
  list: () => apiRequest("/organizations"),
  getOne: (id) => apiRequest(`/organizations/${id}`),
  switch: (organizationId) =>
    apiRequest("/organizations/switch", {
      method: "POST",
      body: { organizationId },
    }),
};
