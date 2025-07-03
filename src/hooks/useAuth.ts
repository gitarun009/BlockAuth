import { useCallback } from "react";

export function useAuth() {
  // Get JWT token from localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem("blockauth_token") || null;
  }, []);

  // Get user role from localStorage
  const getRole = useCallback(() => {
    return localStorage.getItem("blockauth_role") || null;
  }, []);

  // Logout: remove token and role
  const logout = useCallback(() => {
    localStorage.removeItem("blockauth_token");
    localStorage.removeItem("blockauth_role");
    window.location.href = "/login";
  }, []);

  // Attach JWT to fetch options
  const authFetch = useCallback(
    (url: string, options: RequestInit = {}) => {
      const token = getToken();
      const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      return fetch(url, { ...options, headers });
    },
    [getToken]
  );

  return {
    getToken,
    getRole,
    logout,
    authFetch,
    isAuthenticated: !!getToken(),
  };
} 