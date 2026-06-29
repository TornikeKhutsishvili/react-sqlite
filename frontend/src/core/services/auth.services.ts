import { BASE_URL } from "../api/api";
import type { ILoginResponse, IAuthUser, IRegisterPayload } from "../interfaces/auth.interface";

/* LOGIN */
export const loginWithEmailPassword = async (
  email: string,
  password: string
): Promise<ILoginResponse> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

/* REGISTER */
export const registerWithEmailPassword = async (
  payload: IRegisterPayload
): Promise<ILoginResponse> => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Register failed");
  return res.json();
};

/* PROFILE */
export const fetchUserProfile = async (): Promise<IAuthUser> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Profile not found");
  return res.json();
};

// export const fetchUserProfileByUid = async (uid: string): Promise<IAuthUser> => {
//   const res = await fetch(`${BASE_URL}/users/${uid}`);
//   if (!res.ok) throw new Error("User not found");
//   return res.json();
// };

export const updateUserProfile = async (id: number, updates: Partial<IAuthUser>) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

export const signOutUser = async () => {
  return true;
};