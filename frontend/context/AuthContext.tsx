"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Customer } from "@/types/customer";
import {
  loginCustomer,
  logoutCustomer,
  fetchProfile,
  refreshTokenApi,
  mergeCart,
} from "@/lib/api";
import {
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
} from "@/lib/auth";

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setCustomer: (customer: Customer | null) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!customer;

  const refreshAuth = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      setCustomer(null);
      return;
    }
    try {
      const data = (await refreshTokenApi(refreshToken)) as {
        data: { accessToken: string; refreshToken: string };
      };
      setTokens(data.data.accessToken, data.data.refreshToken);
    } catch {
      clearTokens();
      setCustomer(null);
    }
  }, []);

  // Check existing token on mount
  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        await refreshAuth();
      }

      try {
        const data = (await fetchProfile()) as { data: Customer };
        setCustomer(data.data);
      } catch {
        clearTokens();
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshAuth]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) {
        await refreshAuth();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshAuth]);

  const login = async (email: string, password: string) => {
    const data = (await loginCustomer(email, password)) as {
      data: { accessToken: string; refreshToken: string; customer: Customer };
    };
    setTokens(data.data.accessToken, data.data.refreshToken);
    setCustomer(data.data.customer);

    // Merge guest cart into server cart
    try {
      await mergeCart();
    } catch {
      // Non-critical — cart merge failure shouldn't block login
    }
  };

  const logout = async () => {
    try {
      await logoutCustomer();
    } catch {
      // Ignore — still clear local state
    }
    clearTokens();
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setCustomer,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
