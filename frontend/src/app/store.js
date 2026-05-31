import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice.js";
import orgReducer from "../features/organizations/store/orgSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: orgReducer,
  },
});
