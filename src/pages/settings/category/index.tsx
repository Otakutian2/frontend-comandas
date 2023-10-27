import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { ReactElement } from "react";
import { ProgressBar } from "@/components";

const DynamicCategoryPage = dynamic(
  () => import("@/sections/CategorySection"),
  {
    loading: () => <ProgressBar />,
  }
);

const CategoryPage = () => {
  return <DynamicCategoryPage />;
};

CategoryPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default CategoryPage;
