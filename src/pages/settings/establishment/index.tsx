import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DynamicEstablishmentPage = dynamic(
  () => import("@/sections/EstablishmentSection"),
  {
    loading: () => <ProgressBar />,
  }
);

const EstablishmentPage = () => {
  return <DynamicEstablishmentPage />;
};

EstablishmentPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EstablishmentPage;
