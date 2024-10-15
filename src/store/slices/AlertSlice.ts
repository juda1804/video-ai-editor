import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertState {
  variant?: "info" | "info" | "success" | "warning" | "error";
  message: string;
  show?: boolean;
}

const initialState: AlertState = {
  variant: "info",
  message: "",
  show: false,
};

const AlertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<string>) => {
      state.variant = "info";
      state.message = action.payload;
      state.show = true;
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.variant = "success";
      state.message = action.payload;
      state.show = true;
    },
    setWarning: (state, action: PayloadAction<string>) => {
      state.variant = "warning";
      state.message = action.payload;
      state.show = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.variant = "error";
      state.message = action.payload;
      state.show = true;
    },
    hideAlert: () => initialState,
  },
});

export const {
  setInfo,
  setSuccess,
  setWarning,
  setError,
  hideAlert
} = AlertSlice.actions;
export default AlertSlice.reducer;
