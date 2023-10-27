import Layout from "@/components/Layout";
import { ReactElement } from "react";
import ProgressBar from "@/components/ProgressBar";
import dynamic from "next/dynamic";

const DynamicCashPage = dynamic(() => import("@/sections/CashSection"), {
  loading: () => <ProgressBar />,
});

const CashPage = () => {
  return <DynamicCashPage />;
};

CashPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default CashPage;
