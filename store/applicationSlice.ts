// store/applicationSlice.ts

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  JobApplication,
  ApplicationFilters,
  ApplicationStatus,
  CreateApplicationPayload,
} from "@/types/job";

interface ApplicationState {
  applications: JobApplication[];
  filters: ApplicationFilters;
  selectedApplication: JobApplication | null;
  viewMode: "list" | "kanban";
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  filters: {
    status: "all",
    workType: "all",
    search: "",
    tags: [],
  },
  selectedApplication: null,
  viewMode: "kanban",
  status: "idle",
  error: null,
};

// Async Thunks
export const fetchApplications = createAsyncThunk<
  JobApplication[],
  void,
  { rejectValue: string }
>("applications/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/applications", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to fetch applications");
    }
    return (await res.json()) as JobApplication[];
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

export const createApplication = createAsyncThunk<
  JobApplication,
  CreateApplicationPayload,
  { rejectValue: string }
>("applications/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to create application");
    }
    return (await res.json()) as JobApplication;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

export const editApplication = createAsyncThunk<
  JobApplication,
  { id: string; data: Partial<CreateApplicationPayload> },
  { rejectValue: string }
>("applications/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to update application");
    }
    return (await res.json()) as JobApplication;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

export const deleteApplication = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("applications/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/applications/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to delete application");
    }
    return id;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setApplications(state, action: PayloadAction<JobApplication[]>) {
      state.applications = action.payload;
    },
    addApplication(state, action: PayloadAction<JobApplication>) {
      state.applications.unshift(action.payload);
    },
    updateApplication(state, action: PayloadAction<JobApplication>) {
      const index = state.applications.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
    removeApplication(state, action: PayloadAction<string>) {
      state.applications = state.applications.filter(
        (app) => app.id !== action.payload
      );
    },
    setFilters(state, action: PayloadAction<Partial<ApplicationFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    setSelectedApplication(
      state,
      action: PayloadAction<JobApplication | null>
    ) {
      state.selectedApplication = action.payload;
    },
    setViewMode(state, action: PayloadAction<"list" | "kanban">) {
      state.viewMode = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<ApplicationStatus | "all">) {
      state.filters.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchApplications
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // createApplication
    builder
      .addCase(createApplication.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications.unshift(action.payload);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // editApplication
    builder
      .addCase(editApplication.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editApplication.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.applications.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        if (state.selectedApplication?.id === action.payload.id) {
          state.selectedApplication = action.payload;
        }
      })
      .addCase(editApplication.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // deleteApplication
    builder
      .addCase(deleteApplication.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = state.applications.filter(
          (app) => app.id !== action.payload
        );
        if (state.selectedApplication?.id === action.payload) {
          state.selectedApplication = null;
        }
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const {
  setApplications,
  addApplication,
  updateApplication,
  removeApplication,
  setFilters,
  clearFilters,
  setSelectedApplication,
  setViewMode,
  setStatusFilter,
} = applicationSlice.actions;

export default applicationSlice.reducer;
