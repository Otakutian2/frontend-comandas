import UserRoles from "@/interfaces/UserRoles";
import { APP_ROUTES } from "@/routes";
import { ALL_ROUTES, USER_ROUTES } from "@/routes/user.routes";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const role = (user?.role.name as UserRoles) || "Anonimo";
  const routePath = router.asPath;

  if (routePath === APP_ROUTES.login && user) {
    router.push(APP_ROUTES.home);
    return null;
  }

  if (routePath !== APP_ROUTES.login && !user) {
    router.push(APP_ROUTES.login);
    return null;
  }

  if (
    role &&
    role !== "Anonimo" &&
    !Object.values(USER_ROUTES[role]).includes(routePath) &&
    Object.values(ALL_ROUTES).includes(routePath)
  ) {
    router.push(APP_ROUTES.error403);

    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
