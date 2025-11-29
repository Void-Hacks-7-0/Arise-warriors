import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;   // <-- http://localhost:5000/api

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyTwoFactor: (code: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------
  // LOGIN (Minimal Change)
  // -------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (res.data.success) {
        setUser(res.data.user);          // <-- Use backend user
        localStorage.setItem("token", res.data.token);  // Save token
        return { success: true };
      }

      return { success: false, error: "Unknown error" };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // -------------------------------------
  // SIGNUP (Minimal Change)
  // -------------------------------------
  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);

      const [firstName, ...rest] = name.split(" ");
      const lastName = rest.join(" ");

      const res = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        return { success: true };
      }

      return { success: false, error: "Signup failed" };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // -------------------------------------
  // LOGOUT (unchanged)
  // -------------------------------------
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  // -------------------------------------
  // RESET PASSWORD (still mock)
  // -------------------------------------
  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (email.includes('@')) {
      return { success: true };
    }
    return { success: false, error: 'Invalid email' };
  }, []);

  // -------------------------------------
  // 2FA (still mock)
  // -------------------------------------
  const verifyTwoFactor = useCallback(async (code: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);

    if (code === '123456') {
      return { success: true };
    }
    return { success: false, error: 'Invalid code' };
  }, []);

  // -------------------------------------
  // UPDATE USER (unchanged)
  // -------------------------------------
  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
