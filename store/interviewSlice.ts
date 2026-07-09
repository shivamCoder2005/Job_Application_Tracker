// store/interviewSlice.ts

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Interview, CreateInterviewPayload, UpdateInterviewPayload } from "@/types/job";

interface InterviewState {
  interviews: Interview[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InterviewState = {
  interviews: [],
  status: "idle",
  error: null,
};

// Async Thunks
export const fetchInterviews = createAsyncThunk<
  Interview[],
  string | undefined,
  { rejectValue: string }
>("interviews/fetchAll", async (applicationId, { rejectWithValue }) => {
  try {
    const url = applicationId
      ? `/api/interviews?applicationId=${applicationId}`
      : "/api/interviews";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to fetch interviews");
    }
    return (await res.json()) as Interview[];
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

export const scheduleInterview = createAsyncThunk<
  Interview,
  CreateInterviewPayload,
  { rejectValue: string }
>("interviews/schedule", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to schedule interview");
    }
    return (await res.json()) as Interview;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

export const editInterview = createAsyncThunk<
  Interview,
  { id: string; data: UpdateInterviewPayload },
  { rejectValue: string }
>("interviews/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/interviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to update interview");
    }
    return (await res.json()) as Interview;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

export const cancelInterview = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("interviews/cancel", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/interviews/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return rejectWithValue((err as { error?: string }).error ?? "Failed to delete interview");
    }
    return id;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Network error"
    );
  }
});

const interviewSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {
    setInterviews(state, action: PayloadAction<Interview[]>) {
      state.interviews = action.payload;
    },
    addInterview(state, action: PayloadAction<Interview>) {
      state.interviews.push(action.payload);
    },
    updateInterview(state, action: PayloadAction<Interview>) {
      const index = state.interviews.findIndex(
        (int) => int.id === action.payload.id
      );
      if (index !== -1) {
        state.interviews[index] = action.payload;
      }
    },
    removeInterview(state, action: PayloadAction<string>) {
      state.interviews = state.interviews.filter(
        (int) => int.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // fetchInterviews
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.interviews = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // scheduleInterview
    builder
      .addCase(scheduleInterview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.interviews.push(action.payload);
      })
      .addCase(scheduleInterview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // editInterview
    builder
      .addCase(editInterview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editInterview.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.interviews.findIndex(
          (int) => int.id === action.payload.id
        );
        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
      })
      .addCase(editInterview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });

    // cancelInterview
    builder
      .addCase(cancelInterview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(cancelInterview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.interviews = state.interviews.filter(
          (int) => int.id !== action.payload
        );
      })
      .addCase(cancelInterview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { setInterviews, addInterview, updateInterview, removeInterview } =
  interviewSlice.actions;

export default interviewSlice.reducer;
