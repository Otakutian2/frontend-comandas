import { APP_PATHS } from "..";

export const SETTINGS_PATHS = {
  base: "/settings",
};

export const SETTINGS_ROUTES = {
  cash: `${APP_PATHS.base}${SETTINGS_PATHS.base}/cash`,
  category: `${APP_PATHS.base}${SETTINGS_PATHS.base}/category`,
  dish: `${APP_PATHS.base}${SETTINGS_PATHS.base}/dish`,
  employee: `${APP_PATHS.base}${SETTINGS_PATHS.base}/employee`,
  establishment: `${APP_PATHS.base}${SETTINGS_PATHS.base}/establishment`,
  paymentMethod: `${APP_PATHS.base}${SETTINGS_PATHS.base}/payment-method`,
  table: `${APP_PATHS.base}${SETTINGS_PATHS.base}/table`,
};
