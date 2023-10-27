import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DynamicPaymentMethodPage = dynamic(
  () => import("@/sections/PaymentMethodSection"),
  {
    loading: () => <ProgressBar />,
  }
);

const PaymentMethodPage = () => {
  return <DynamicPaymentMethodPage />;
};

PaymentMethodPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PaymentMethodPage;
