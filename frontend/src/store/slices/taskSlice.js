import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

const initialState = {
  tasks: [],
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await taskService.getTasks(token, filters);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await taskService.createTask(token, taskData);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, taskData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await taskService.updateTask(token, id, taskData);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await taskService.deleteTask(token, id);
      return id;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getStats = createAsyncThunk(
  'tasks/getStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await taskService.getStats(token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  }
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;