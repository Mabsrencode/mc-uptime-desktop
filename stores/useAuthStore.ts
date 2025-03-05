import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  data: {
    user: { userID: string; email: string; number?: string | null } | null;
  } | null;
  logout: () => void;
}

const isClient = typeof window !== "undefined";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      data: null,
      logout: () => set({ data: null }),
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          if (!isClient) return null;
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          if (!isClient) return;
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (!isClient) return;
          localStorage.removeItem(name);
        },
      },
    }
  )
);
