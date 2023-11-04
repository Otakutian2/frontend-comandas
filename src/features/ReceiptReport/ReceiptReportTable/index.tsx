import { IReceiptReportGet } from "@/interfaces/IReceiptReport";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueGetterParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { AxiosServices } from "@/services";
import { DataTable } from "@/components";
import { Typography } from "@mui/material";
import { showSuccessMessage } from "@/lib/Messages";

interface IReceiptReportTableProps {
  data: IReceiptReportGet[];
}

const ReceiptReportTable = ({ data }: IReceiptReportTableProps) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Número de Comprobante",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "customerFullName",
      headerName: "Cliente",
      minWidth: 250,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<IReceiptReportGet>) =>
        `${params.row.customer.firstName} ${params.row.customer.lastName}`,
    },
    {
      field: "waiterFullName",
      headerName: "Mesero",
      minWidth: 250,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<IReceiptReportGet>) =>
        `${params.row.command.employee.firstName} ${params.row.command.employee.lastName}`,
    },
    {
      field: "createdAt",
      headerName: "Fecha de Emisión",
      type: "dateTime",
      minWidth: 160,
      flex: 1,
      valueGetter: (params: GridValueGetterParams<IReceiptReportGet>) =>
        dayjs(params.row.createdAt).toDate(),
    },
    {
      field: "receiptType",
      headerName: "Tipo de Comprobante",
      minWidth: 160,
      flex: 1,
      valueGetter: (params: GridValueGetterParams<IReceiptReportGet>) =>
        params.row.receiptType.name,
    },

    {
      field: "cash",
      headerName: "Caja",
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams<IReceiptReportGet>) =>
        params.row.cash.id,
    },
    {
      field: "totalPrice",
      headerName: "Precio Total",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 140,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        `S/. ${(params.value as number).toFixed(2)}`,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      minWidth: 100,
      flex: 1,
      getActions: (receiptReport: GridRowParams<IReceiptReportGet>) => {
        return [
          <GridActionsCellItem
            key={receiptReport.row.id}
            icon={
              <>
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "error.main",
                    color: "white",
                    padding: "0.5rem 0.7rem",
                    borderRadius: 1,
                  }}
                >
                  <InsertDriveFile />
                  <Typography>PDF</Typography>
                </Box>
              </>
            }
            label="PDF"
            color="error"
            onClick={async () => {
              const { isDismissed } = await Swal.fire({
                title: "Cargando PDF ...",
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: async () => {
                  Swal.showLoading();

                  console.log(receiptReport.row.id);
                  const { data } = await AxiosServices.get(
                    `api/report/receipt/${receiptReport.row.id}`,
                    { responseType: "blob" }
                  );

                  const url = URL.createObjectURL(data);

                  window.open(url, "_blank");

                  URL.revokeObjectURL(url);
                  Swal.close();
                },
              });

              if (isDismissed) {
                showSuccessMessage(
                  "¡Carga completada! Ya puedes visualizar el comprobante de pago"
                );
              }
            }}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={data} />
    </>
  );
};

export default ReceiptReportTable;
