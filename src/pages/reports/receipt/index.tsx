import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DynamicReceiptReportPage = dynamic(
  () => import("@/sections/ReceiptReportSection"),
  {
    loading: () => <ProgressBar />,
  }
);

const ReceiptReportPage = () => {
  return <DynamicReceiptReportPage />;
};

ReceiptReportPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ReceiptReportPage;
