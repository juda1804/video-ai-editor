import { createSlice } from '@reduxjs/toolkit';

export interface LoadingState {
  counter: number;
  show: boolean;
}

const initialState: LoadingState = {
  counter: 0,
  show: false
};

const LoadingSlice = createSlice({
  name: 'loading',
  initialState: initialState,
  reducers: {
    addLoading: (state) => {
      state.counter += 1;
      state.show = true;
    },
    reduceLoading: (state) => {
      if (state.counter > 0) state.counter -= 1;
      state.show = state.counter !== 0;
    },
    hideLoading: () => initialState,
  },
});

export const { addLoading, reduceLoading, hideLoading } = LoadingSlice.actions;
export default LoadingSlice.reducer;
