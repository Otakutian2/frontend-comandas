import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar";
import { ReactElement } from "react";

const DynamicAccountPage = dynamic(() => import("@/components/AccountForm"), {
  loading: () => <ProgressBar />,
});

const AccountPage = () => {
  return <DynamicAccountPage />;
};

AccountPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default AccountPage;
