import { apiRequest } from "../../../shared/api/client.js";

export const activityApi = {
  list: () => apiRequest("/activity"),
};
