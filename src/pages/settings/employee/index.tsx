import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { ReactElement } from "react";
import { ProgressBar } from "@/components";

const DynamicEmployeePage = dynamic(
  () => import("@/sections/EmployeeSection"),
  {
    loading: () => <ProgressBar />,
  }
);

const EmployeePage = () => {
  return <DynamicEmployeePage />;
};

EmployeePage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EmployeePage;
