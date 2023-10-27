import { APP_PATHS } from "..";

export const REPORTS_PATHS = {
  base: "/reports",
};

export const REPORTS_ROUTES = {
  receipt: `${APP_PATHS.base}${REPORTS_PATHS.base}/receipt`,
  sales: `${APP_PATHS.base}${REPORTS_PATHS.base}/sales`,
};
