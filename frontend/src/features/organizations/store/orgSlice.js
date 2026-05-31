import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orgApi } from "../api/orgApi.js";
import { storage } from "../../../shared/lib/storage.js";

export const fetchOrganizations = createAsyncThunk(
  "org/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await orgApi.list();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createOrganization = createAsyncThunk(
  "org/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await orgApi.create(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const switchOrganization = createAsyncThunk(
  "org/switch",
  async (organizationId, { rejectWithValue }) => {
    try {
      const res = await orgApi.switch(organizationId);
      const { accessToken, org, membership } = res.data;
      storage.setAccessToken(accessToken);
      storage.setActiveOrg({
        id: org.id?._id || org.id,
        name: org.name,
        slug: org.slug,
        role: membership.role,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const orgSlice = createSlice({
  name: "organizations",
  initialState: {
    list: [],
    activeOrg: storage.getActiveOrg(),
    loading: false,
    error: null,
  },
  reducers: {
    clearOrgError: (state) => {
      state.error = null;
    },
    setActiveOrgRole: (state, action) => {
      const role = action.payload;
      if (state.activeOrg) {
        state.activeOrg = { ...state.activeOrg, role };
        storage.setActiveOrg(state.activeOrg);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(switchOrganization.fulfilled, (state, action) => {
        const { org, membership } = action.payload;
        state.activeOrg = {
          id: org.id?._id || org.id,
          name: org.name,
          slug: org.slug,
          role: membership.role,
        };
      });
  },
});

export const { clearOrgError, setActiveOrgRole } = orgSlice.actions;
export default orgSlice.reducer;
