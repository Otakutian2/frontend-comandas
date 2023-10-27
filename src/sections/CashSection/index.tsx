import ButtonAdd from "@/components/ButtonAdd";
import PointOfSale from "@mui/icons-material/PointOfSale";
import ContentBox from "@/components/ContentBox";
import CashTable from "@/features/Cash/CashTable";
import CashAddForm from "@/features/Cash/CashAddForm";
import Box from "@mui/material/Box";
import LoaderComponent from "@/components/LoaderComponent";
import useSWR from "swr";
import { ICashGet, ICashPrincipal } from "@/interfaces/ICash";
import { FormikProps } from "formik/dist/types";
import { showForm } from "@/lib/Forms";
import { fetchAll, getObject } from "@/services/HttpRequests";
import { IEstablishmentGet } from "@/interfaces/IEstablishment";
import Title from "@/components/Title";
import { useRef } from "react";

const CashSection = () => {
  const formikRef = useRef<FormikProps<ICashPrincipal>>(null);
  const { data: cashies, isLoading: isLoadingCashies } = useSWR(
    "api/cash",
    () => fetchAll<ICashGet>("api/cash")
  );

  const { data: establishment, isLoading: isLoadingEstablishment } = useSWR(
    "api/establishment/first",
    () => getObject<IEstablishmentGet>("api/establishment/first")
  );

  if (isLoadingCashies || isLoadingEstablishment) return <LoaderComponent />;

  return (
    <ContentBox>
      <Box sx={{ marginTop: 2, marginX: 2 }}>
        <Title variant="h2">Cajas</Title>

        <ButtonAdd
          text="Añadir Caja"
          openDialog={() => {
            showForm({
              title: "Añadir Caja",
              cancelButtonText: "CANCELAR",
              confirmButtonText: "AÑADIR",
              customClass: {
                confirmButton: "custom-confirm custom-confirm-create",
              },
              icon: (
                <PointOfSale
                  sx={{
                    display: "block",
                    margin: "auto",
                    fontSize: "5rem",
                    color: "#0D6EFD",
                  }}
                  color="primary"
                />
              ),
              contentHtml: (
                <CashAddForm
                  customRef={formikRef}
                  establishment={establishment!}
                />
              ),
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

      <CashTable data={cashies!} />
    </ContentBox>
  );
};

export default CashSection;
