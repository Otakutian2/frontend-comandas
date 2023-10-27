import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Payment from "@mui/icons-material/Payment";
import DataTable from "@/components/DataTable";
import DeleteForever from "@mui/icons-material/DeleteForever";
import PaymentMethodUpdateForm from "@/features/PaymentMethod/PaymentMethodUpdateForm";
import {
  useGridApiRef,
  GridActionsCellItem,
  GridRowParams,
  GridColDef,
} from "@mui/x-data-grid";
import { deleteObject, getObject } from "@/services/HttpRequests";
import {
  IPaymentMethodGet,
  IPaymentMethodPrincipal,
} from "@/interfaces/IPaymentMethod";
import { handleLastPageDeletion } from "@/utils";
import { showForm } from "@/lib/Forms";
import { showErrorMessage, showSuccessToastMessage } from "@/lib/Messages";
import { FormikProps } from "formik/dist/types";
import { useSWRConfig } from "swr";
import { useRef } from "react";

interface IPaymentMethodTableProps {
  data: IPaymentMethodGet[];
}

const PaymentMethodTable = ({ data }: IPaymentMethodTableProps) => {
  const formikRef = useRef<FormikProps<IPaymentMethodPrincipal>>(null);

  const { mutate } = useSWRConfig();

  const gridApiRef = useGridApiRef();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100, flex: 1 },
    {
      field: "name",
      headerName: "Método de Pago",
      minWidth: 250,
      flex: 11,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      minWidth: 100,
      flex: 1,
      getActions: (paymentMethod: GridRowParams<IPaymentMethodGet>) => {
        return [
          <GridActionsCellItem
            key={paymentMethod.row.id}
            icon={<Edit />}
            label="Edit"
            color="warning"
            onClick={() => {
              showForm({
                title: "Actualizar Método de Pago",
                cancelButtonText: "CANCELAR",
                confirmButtonText: "ACTUALIZAR",
                customClass: {
                  confirmButton: "custom-confirm custom-confirm-update",
                },
                icon: (
                  <Payment
                    sx={{
                      display: "block",
                      margin: "auto",
                      fontSize: "5rem",
                      color: "#ED6C02",
                    }}
                    color="primary"
                  />
                ),
                contentHtml: (
                  <PaymentMethodUpdateForm
                    customRef={formikRef}
                    values={paymentMethod.row}
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
          />,
          <GridActionsCellItem
            key={paymentMethod.row.id}
            icon={<Delete />}
            label="Delete"
            color="error"
            onClick={async () => {
              const count = await getObject<number>(
                `api/PaymentMethod/${paymentMethod.id}/number-receipts-details`
              );

              if (count > 0) {
                showErrorMessage({
                  title: `NO SE PUEDE ELIMINAR EL MÉTODO DE PAGO - ${paymentMethod.id}`,
                  contentHtml: `No es posible eliminar el método de pago debido a que se encontró ${count} comprobrante${
                    count !== 1 ? "s" : ""
                  } de pago asignado a dicho método.`,
                });

                return;
              }

              showForm({
                title: "Eliminar Método de Pago",
                cancelButtonText: "CANCELAR",
                confirmButtonText: "ELIMINAR",
                customClass: {
                  confirmButton: "custom-confirm custom-confirm-create",
                },
                icon: (
                  <DeleteForever
                    sx={{
                      display: "block",
                      margin: "auto",
                      fontSize: "5rem",
                    }}
                    color="error"
                  />
                ),
                contentHtml: (
                  <Typography>
                    ¿Estás seguro de eliminar el método de pago{" "}
                    {`"${paymentMethod.row.name}"`}?
                  </Typography>
                ),
                preConfirm: async () => {
                  await deleteObject(
                    `api/PaymentMethod/${paymentMethod.row.id}`
                  );
                  handleLastPageDeletion(gridApiRef, data.length);
                  mutate("api/PaymentMethod");

                  showSuccessToastMessage(
                    "El método de pago se ha eliminado correctamente"
                  );
                },
              });
            }}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <DataTable apiRef={gridApiRef} columns={columns} rows={data} />
    </>
  );
};

export default PaymentMethodTable;
