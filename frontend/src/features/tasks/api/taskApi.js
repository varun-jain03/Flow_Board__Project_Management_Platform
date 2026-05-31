import { apiRequest } from "../../../shared/api/client.js";

export const taskApi = {
  create: (data) => apiRequest("/tasks", { method: "POST", body: data }),
  list: (workspaceId, boardId, { page = 1, limit = 50 } = {}) =>
    apiRequest(
      `/tasks/board/${workspaceId}/${boardId}?page=${page}&limit=${limit}`,
    ),
  getOne: (workspaceId, boardId, taskId) =>
    apiRequest(`/tasks/board/${workspaceId}/${boardId}/${taskId}`),
  update: (workspaceId, boardId, taskId, data) =>
    apiRequest(`/tasks/board/${workspaceId}/${boardId}/${taskId}`, {
      method: "PATCH",
      body: data,
    }),
  remove: (workspaceId, boardId, taskId) =>
    apiRequest(`/tasks/board/${workspaceId}/${boardId}/${taskId}`, {
      method: "DELETE",
    }),
};
