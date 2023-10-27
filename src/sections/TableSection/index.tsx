import ContentBox from "@/components/ContentBox";
import Table from "@/features/Table/Table";
import TableBar from "@mui/icons-material/TableBar";
import TableAddForm from "@/features/Table/TableAddForm";
import Box from "@mui/material/Box";
import ButtonAdd from "@/components/ButtonAdd";
import LoaderComponent from "@/components/LoaderComponent";
import useSWR from "swr";
import { ITableGet, ITablePrincipal } from "@/interfaces/ITable";
import { FormikProps } from "formik/dist/types";
import { showForm } from "@/lib/Forms";
import { fetchAll } from "@/services/HttpRequests";
import Title from "@/components/Title";
import { useRef } from "react";

const TableSection = () => {
  const formikRef = useRef<FormikProps<ITablePrincipal>>(null);
  const { data, isLoading } = useSWR("api/Table", () =>
    fetchAll<ITableGet>("api/Table")
  );

  if (isLoading) return <LoaderComponent />;

  return (
    <ContentBox>
      <Box sx={{ marginTop: 2, marginX: 2 }}>
        <Title variant="h2">Mesas</Title>

        <ButtonAdd
          text="Añadir Mesa"
          openDialog={() => {
            showForm({
              title: "Añadir Mesa",
              cancelButtonText: "CANCELAR",
              confirmButtonText: "AÑADIR",
              customClass: {
                confirmButton: "custom-confirm custom-confirm-create",
              },
              icon: (
                <TableBar
                  sx={{
                    display: "block",
                    margin: "auto",
                    fontSize: "5rem",
                    color: "#0D6EFD",
                  }}
                  color="primary"
                />
              ),
              contentHtml: <TableAddForm customRef={formikRef} />,
              preConfirm: async () => {
                await formikRef.current?.submitForm();
                if (formikRef && !formikRef.current?.isValid) {
                  return false;
                }
              },
            });
          }}
        />
      </Box>

      <Table data={data!} />
    </ContentBox>
  );
};

export default TableSection;
