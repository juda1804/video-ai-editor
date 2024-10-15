;
import loadingReducer, { LoadingState } from './slices/LoadingSlice';
import alertReducer, { AlertState } from './slices/AlertSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    alert: alertReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = {
  loading: LoadingState;
  alert: AlertState;
};
export type AppDispatch = typeof store.dispatch;

export default store;
