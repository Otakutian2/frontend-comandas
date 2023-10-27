import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar";
import { ReactElement } from "react";

const DynamicDishPage = dynamic(() => import("@/sections/DishSection"), {
  loading: () => <ProgressBar />,
});

const DishPage = () => {
  return <DynamicDishPage />;
};

DishPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default DishPage;
