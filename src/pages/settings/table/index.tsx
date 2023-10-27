import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DynamicTablePage = dynamic(() => import("@/sections/TableSection"), {
  loading: () => <ProgressBar />,
});

const TablePage = () => {
  return <DynamicTablePage />;
};

TablePage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TablePage;
