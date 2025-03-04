import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  data: { user: { email: string } | null } | null;
  logout: () => void;
}

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
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
