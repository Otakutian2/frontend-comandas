import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IAuthStore {
  accessToken?: string;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      (set) => ({
        accessToken: undefined,
        setAccessToken: (accessToken: string) =>
          set((state) => ({ accessToken })),

        clearTokens: () => {
          window.location.reload();
          set({ accessToken: undefined });
        },
      }),
      {
        name: "auth-storage",
      }
    )
  )
);
