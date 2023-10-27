import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DynamicHomePage = dynamic(() => import("@/components/Welcome"), {
  loading: () => <ProgressBar />,
});

const HomePage = () => {
  return <DynamicHomePage />;
};

HomePage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default HomePage;
