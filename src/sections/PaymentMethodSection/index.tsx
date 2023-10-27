import ContentBox from "@/components/ContentBox";
import AddCard from "@mui/icons-material/AddCard";
import PaymentMethodTable from "@/features/PaymentMethod/PaymentMethodTable";
import PaymentMethodAddForm from "@/features/PaymentMethod/PaymentMethodAddForm";
import Box from "@mui/material/Box";
import ButtonAdd from "@/components/ButtonAdd";
import LoaderComponent from "@/components/LoaderComponent";
import useSWR from "swr";
import {
  IPaymentMethodGet,
  IPaymentMethodPrincipal,
} from "@/interfaces/IPaymentMethod";
import { FormikProps } from "formik/dist/types";
import { showForm } from "@/lib/Forms";
import { fetchAll } from "@/services/HttpRequests";
import Title from "@/components/Title";
import { useRef } from "react";

const PaymentMethodSection = () => {
  const formikRef = useRef<FormikProps<IPaymentMethodPrincipal>>(null);
  const { data, isLoading } = useSWR("api/PaymentMethod", () =>
    fetchAll<IPaymentMethodGet>("api/PaymentMethod")
  );

  if (isLoading) return <LoaderComponent />;

  return (
    <ContentBox>
      <Box sx={{ marginTop: 2, marginX: 2 }}>
        <Title variant="h2">Métodos de Pagos</Title>

        <ButtonAdd
          text="Añadir Método de Pago"
          openDialog={() => {
            showForm({
              title: "Añadir Método de Pago",
              cancelButtonText: "CANCELAR",
              confirmButtonText: "AÑADIR",
              customClass: {
                confirmButton: "custom-confirm custom-confirm-create",
              },
              icon: (
                <AddCard
                  sx={{
                    display: "block",
                    margin: "auto",
                    fontSize: "5rem",
                    color: "#0D6EFD",
                  }}
                  color="primary"
                />
              ),
              contentHtml: <PaymentMethodAddForm customRef={formikRef} />,
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

      <PaymentMethodTable data={data!} />
    </ContentBox>
  );
};

export default PaymentMethodSection;
