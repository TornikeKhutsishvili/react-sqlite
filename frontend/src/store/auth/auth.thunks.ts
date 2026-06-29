import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "..";
import type { IAuthUser, IRegisterPayload } from "../../core/interfaces/auth.interface";
import { sessionService } from "../../core/services/session.services";

import {
  loginWithEmailPassword,
  registerWithEmailPassword,
  fetchUserProfile,
  updateUserProfile,
  signOutUser,
} from "../../core/services/auth.services";

/* LOGIN */
export const login = createAsyncThunk<
  IAuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    const res = await loginWithEmailPassword(email, password);
    sessionService.setSession(res.user.id.toString(), res.token);

    return {
      ...res.user,
      token: res.token,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error instanceof Error ? error.message : "Login failed");
  }
});

/* REGISTER */
export const register = createAsyncThunk<
  IAuthUser,
  IRegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, thunkAPI) => {
  try {
    const res = await registerWithEmailPassword(payload);
    sessionService.setSession(res.user.id.toString(), res.token);

    return {
      ...res.user,
      token: res.token,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error instanceof Error ? error.message : "Registration failed");
  }
});

/* LOAD CURRENT USER */
export const loadCurrentUser = createAsyncThunk<
  IAuthUser,
  void,
  { rejectValue: string }
>("auth/loadCurrentUser", async (_, thunkAPI) => {
  try {
    const user = await fetchUserProfile();
    const token = sessionService.getToken();

    return {
      ...user,
      token: token ?? "",
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error instanceof Error ? error.message : "Failed to load user");
  }
});

/* LOGOUT */
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const user = state.auth.user;

    await signOutUser();
    if (user) sessionService.clearSession();
  } catch (error) {
    return thunkAPI.rejectWithValue(error instanceof Error ? error.message : "Logout failed");
  }
});

/* UPDATE */
export const updateCurrentUser = createAsyncThunk<
  IAuthUser,
  Partial<IAuthUser>,
  { rejectValue: string }
>("auth/updateCurrentUser", async (updates, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const user = state.auth.user;

    if (!user) throw new Error("No current user");
    const updated = await updateUserProfile(user.id, updates);

    return {
      ...updated,
      token: sessionService.getToken() ?? "",
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error instanceof Error ? error.message : "Update failed");
  }
});