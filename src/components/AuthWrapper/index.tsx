import React, { ReactNode, useEffect, useState } from "react";
import LoaderCustom from "../Loader";
import { useUserStore } from "@/store/user";
import { useAuthStore } from "@/store/auth";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { accessToken, clearTokens } = useAuthStore((state) => state);
  const { fetchUser, user, clearUser } = useUserStore((state) => state);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", (event) => {
      if (event.key === "auth-storage" && event.newValue === null) {
        clearTokens();
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      loadUser();
      return;
    }

    if (user) {
      clearUser();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const loadUser = async () => {
    try {
      await fetchUser();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoaderCustom />;

  return <>{children}</>;
};

export default AuthWrapper;
