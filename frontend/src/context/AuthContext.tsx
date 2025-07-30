import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../types/auth";
import { api } from "../services/api";
import { AuthContext, type AuthContextType } from "./AuthContextDef";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (storedAccessToken && storedRefreshToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          // Test if the token is still valid by making a request
          try {
            await api.get("/auth/health");
            // Token is valid
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(userData);
            setIsAuthenticated(true);
          } catch {
            // Token is invalid, try to refresh
            try {
              const refreshResponse = await api.post<AuthResponse>(
                "/auth/refresh",
                {},
                {
                  headers: { Authorization: `Bearer ${storedRefreshToken}` },
                }
              );

              // Update with new tokens
              setAccessToken(refreshResponse.data.accessToken);
              setRefreshToken(refreshResponse.data.refreshToken);
              setUser(refreshResponse.data.user);
              setIsAuthenticated(true);

              // Update localStorage
              localStorage.setItem(
                "accessToken",
                refreshResponse.data.accessToken
              );
              localStorage.setItem(
                "refreshToken",
                refreshResponse.data.refreshToken
              );
              localStorage.setItem(
                "user",
                JSON.stringify(refreshResponse.data.user)
              );
            } catch (refreshError) {
              // Refresh failed, clear everything
              console.error("Token refresh failed:", refreshError);
              logout();
            }
          }
        } catch {
          console.error("Error parsing stored user data");
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (response: AuthResponse) => {
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setUser(response.user);
    setIsAuthenticated(true);

    // Store in localStorage
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.user));
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const updateTokens = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    // Update localStorage
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    updateTokens,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
