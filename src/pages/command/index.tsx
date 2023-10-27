import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar";
import Layout from "@/components/Layout";

const DynamicCommandPage = dynamic(() => import("@/sections/CommandSection"), {
  loading: () => <ProgressBar />,
});

const CommandPage = () => {
  return <DynamicCommandPage />;
};

CommandPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default CommandPage;
