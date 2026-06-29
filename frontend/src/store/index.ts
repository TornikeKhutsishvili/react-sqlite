import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/auth.slice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;