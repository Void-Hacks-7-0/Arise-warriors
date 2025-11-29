import { api } from "@/lib/api";

export async function login(email: string, password: string) {
  const response = await api.post("/api/auth/login", { email, password });

  const { user, token } = response.data;

  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return user;
}
