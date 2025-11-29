import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export async function createTransaction(token: string, data: any) {
  const res = await fetch(`${api}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getTransactions(token: string) {
  const res = await fetch(`${api}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}