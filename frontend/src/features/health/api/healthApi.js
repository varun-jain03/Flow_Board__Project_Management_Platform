import { apiRequest } from "../../../shared/api/client.js";

export const healthApi = {
  check: () => apiRequest("/health", { auth: false }),
};
