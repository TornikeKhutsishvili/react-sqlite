export const BASE_URL=import.meta.env.VITE_APP_BASE_URL

export const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};