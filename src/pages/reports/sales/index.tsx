import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DynamicSalesReportPage = dynamic(
  () => import("@/sections/SalesReportSection"),
  {
    loading: () => <ProgressBar />,
  }
);

const SalesReportPage = () => {
  return <DynamicSalesReportPage />;
};

SalesReportPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default SalesReportPage;
