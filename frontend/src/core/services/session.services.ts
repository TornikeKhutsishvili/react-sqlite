const SESSION_KEY = "sessionId";
const TOKEN_KEY = "token";

export const sessionService = {
  setSession(sessionId: string, token: string) {
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(TOKEN_KEY, token);
  },

  getSessionId(): string | null {
    return localStorage.getItem(SESSION_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};