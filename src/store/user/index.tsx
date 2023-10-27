import { ICurrentUser } from "@/interfaces";
import { getUser } from "@/lib";
import { url } from "gravatar";
import { create } from "zustand";

interface IUserStore {
  user?: ICurrentUser;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<IUserStore>()((set) => ({
  user: undefined,
  fetchUser: async () => {
    const user = (await getUser()) as ICurrentUser;

    if (user) {
      const avatar_url = url(user.user.email, { d: "identicon" }, true);
      user.image = avatar_url;
    }

    set((state) => ({ user }));
  },
  clearUser: () => set({ user: undefined }),
}));
