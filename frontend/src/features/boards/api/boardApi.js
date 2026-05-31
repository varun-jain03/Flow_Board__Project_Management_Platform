import { apiRequest } from "../../../shared/api/client.js";

export const boardApi = {
  create: (data) => apiRequest("/boards", { method: "POST", body: data }),
  list: (workspaceId) => apiRequest(`/boards/workspace/${workspaceId}`),
  getOne: (workspaceId, boardId) =>
    apiRequest(`/boards/workspace/${workspaceId}/${boardId}`),
  update: (workspaceId, boardId, data) =>
    apiRequest(`/boards/workspace/${workspaceId}/${boardId}`, {
      method: "PATCH",
      body: data,
    }),
  archive: (workspaceId, boardId, isArchived) =>
    apiRequest(`/boards/workspace/${workspaceId}/archive/${boardId}`, {
      method: "PATCH",
      body: { isArchived },
    }),
  remove: (workspaceId, boardId) =>
    apiRequest(`/boards/workspace/${workspaceId}/${boardId}`, {
      method: "DELETE",
    }),
};
