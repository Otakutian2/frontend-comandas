import UserRoles from "@/interfaces/UserRoles";
import { REPORTS_ROUTES } from "./reports";
import { APP_ROUTES } from ".";
import { SETTINGS_ROUTES } from "./settings";

const { receipt } = REPORTS_ROUTES;
const { account, home, login, error403, error404, command } = APP_ROUTES;

export const ALL_ROUTES = {
  account,
  home,
  command,
  error403,
  error404,
  ...REPORTS_ROUTES,
  ...SETTINGS_ROUTES,
};

export const USER_ROUTES: Record<UserRoles, { [key: string]: string }> = {
  Administrador: ALL_ROUTES,
  Cajero: { account, home, receipt, error403, error404, command },
  Cocinero: { account, home, error403, error404, command },
  Gerente: { account, home, error403, error404, ...REPORTS_ROUTES },
  Mesero: { account, home, error403, error404, command },
  Anonimo: { login },
};
