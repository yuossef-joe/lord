import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { cmsLogin as apiLogin, cmsLogout as apiLogout } from "@/lib/api";

interface Admin {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cmsToken");
    const savedAdmin = localStorage.getItem("cmsAdmin");
    if (token && savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch {
        localStorage.removeItem("cmsToken");
        localStorage.removeItem("cmsAdmin");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    if (useMock) {
      if (username === "admin" && password === "admin") {
        const mockAdmin: Admin = {
          id: "1",
          username: "admin",
          name: "Admin User",
          email: "admin@lordac.com",
          role: "super_admin",
        };
        localStorage.setItem("cmsToken", "mock-jwt-token");
        localStorage.setItem("cmsAdmin", JSON.stringify(mockAdmin));
        setAdmin(mockAdmin);
        return;
      }
      throw new Error("Invalid credentials");
    }
    const res = await apiLogin(username, password);
    localStorage.setItem("cmsToken", res.token);
    localStorage.setItem("cmsAdmin", JSON.stringify(res.admin));
    setAdmin(res.admin as Admin);
  }, []);

  const logout = useCallback(() => {
    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    if (!useMock) {
      apiLogout().catch(() => {});
    }
    localStorage.removeItem("cmsToken");
    localStorage.removeItem("cmsAdmin");
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ admin, isAuthenticated: !!admin, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
