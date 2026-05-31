import { apiRequest } from "../../../shared/api/client.js";

export const workspaceApi = {
  create: (data) => apiRequest("/workspaces", { method: "POST", body: data }),
  list: () => apiRequest("/workspaces"),
  getOne: (workspaceId) => apiRequest(`/workspaces/${workspaceId}`),
  update: (workspaceId, data) =>
    apiRequest(`/workspaces/update/${workspaceId}`, {
      method: "PATCH",
      body: data,
    }),
  archive: (workspaceId, isArchived) =>
    apiRequest(`/workspaces/archive/${workspaceId}`, {
      method: "PATCH",
      body: { isArchived },
    }),
  remove: (workspaceId) =>
    apiRequest(`/workspaces/${workspaceId}`, { method: "DELETE" }),
};
