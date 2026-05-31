import { apiRequest } from "../../../shared/api/client.js";

export const commentApi = {
  create: (data) => apiRequest("/comments", { method: "POST", body: data }),
  list: (taskId) => apiRequest(`/comments/task/${taskId}`),
  remove: (commentId) =>
    apiRequest(`/comments/${commentId}`, { method: "DELETE" }),
};
