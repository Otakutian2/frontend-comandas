import { ProgressBar } from "@/components";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DynamicCommandDetailsPage = dynamic(
  () => import("@/sections/CommandDetailsSection"),
  {
    loading: () => <ProgressBar />,
  }
);

const CommandDetailsPage = () => {
  return <DynamicCommandDetailsPage />;
};

CommandDetailsPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default CommandDetailsPage;
