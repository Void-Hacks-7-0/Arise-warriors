import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { api } from "@/lib/api"; // <-- must exist (axios instance)

// -----------------------------
// Auth Context Types
// -----------------------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;

  logout: () => void;

  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;

  verifyTwoFactor: (
    code: string
  ) => Promise<{ success: boolean; error?: string }>;

  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------
  // Load token + user on app start
  // ----------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // ----------------------------------
  // LOGIN
  // ----------------------------------
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const res = await api.post("/api/auth/login", { email, password });

      const { user, token } = res.data;

      // Save credentials
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ----------------------------------
  // SIGNUP
  // ----------------------------------
  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        setIsLoading(true);

        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        const res = await api.post("/api/auth/register", {
          email,
          password,
          firstName,
          lastName,
        });

        const { user, token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.error || "Signup failed",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ----------------------------------
  // LOGOUT
  // ----------------------------------
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  }, []);

  // ----------------------------------
  // RESET PASSWORD (via Firebase)
  // ----------------------------------
  const resetPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);

      const res = await api.post("/api/auth/reset-password", { email });

      if (res.data.success) {
        return { success: true };
      }
      return { success: false, error: "Unable to reset password" };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Error resetting password",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ----------------------------------
  // VERIFY 2FA
  // ----------------------------------
  const verifyTwoFactor = useCallback(async (code: string) => {
    try {
      setIsLoading(true);

      const res = await api.post("/api/auth/verify-2fa", { code });

      if (res.data.success) {
        return { success: true };
      }

      return { success: false, error: "Invalid code" };
    } catch (error) {
      return { success: false, error: "Verification failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ----------------------------------
  // UPDATE USER LOCALLY
  // ----------------------------------
  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;

      const updated = { ...prev, ...data };

      localStorage.setItem("user", JSON.stringify(updated));

      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        verifyTwoFactor,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
