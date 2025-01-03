import dayjs from "dayjs";
import DataTable from "@/components/DataTable";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { IAccumulatedPayment, ISalesDataPerDate } from "@/interfaces/IReceiptReport";
import { ramdonKey } from "@/utils";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { use, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { fetchAll } from "@/services";
interface ISalesDataTableProps {
  data: ISalesDataPerDate[];
}



const SalesDataTable = ({ data }: ISalesDataTableProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [accumulatedPayment, setAccumulatedPayment] = useState<
    IAccumulatedPayment[]
  >([]);

 

  const closeModal = () => {
    setOpenModal(false);
    setAccumulatedPayment([]);
  };
  
  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Fecha",
      type: "date",
      minWidth: 150,
      sortable: false,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) => {
        return dayjs(params.value as Date).format("DD/MM/YYYY");
      },
      valueGetter: (params: GridValueGetterParams<ISalesDataPerDate>) =>
        dayjs(params.row.createdAt).toDate(),
    },
    {
      field: "accumulatedSales",
      headerName: "Venta Acumulada",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 160,
      sortable: false,
      flex: 2,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `S/. ${(params.value as number).toFixed(2)}`;
      },
    },
    {
      field: "numberOfGeneratedReceipts",
      headerName: "Comprobantes Generados",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 270,
      sortable: false,
      flex: 1,
    },
    {
      field: "quantityOfDishSales",
      headerName: "Cantidad de Platos Vendidos",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 230,
      sortable: false,
      flex: 1,
    },
    {
      field: "bestSellingDish",
      headerName: "Plato más Vendido del Día",
      minWidth: 200,
      sortable: false,
      flex: 3,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (fa: GridRowParams<ISalesDataPerDate>) => {
        return [
          <>
            <GridActionsCellItem
              icon={
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "primary.main",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    padding: "0.5rem 0.7rem",
                    borderRadius: 1,
                    zIndex: 999,
                  }}
                >
                  <VisibilityIcon />
                </Box>
              }
              label="Ver Detalles de la Venta"
              color="primary"
              onClick={
                () => {
                  setOpenModal(true);
                  setAccumulatedPayment(fa.row.accumulatedPaymentsByDays);
                }
              }
            />
          </>,
        ];
      },
    },
  ];

  return (
    <>
      <DataTable
        rowHeight={130}
        columns={columns}
        rows={data}
        getRowId={(row) => row.createdAt}
      />

     {openModal && DialogContentModal(openModal, closeModal,accumulatedPayment)} 
    </>
  );
};

const DialogContentModal = (
  openModal: boolean,
  closeModal: () => void,
  accumulatedPayment: IAccumulatedPayment[]
) => {
  

  return (
    <Dialog open={openModal}>
      <DialogTitle align="center" typography={"h6"}>
        Ventas acumuladas por metodos de pago
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        >
          {accumulatedPayment.length > 0 ? (
            <>
              {accumulatedPayment.map((accumulatedPayment) => (
                <Typography
                  key={ramdonKey("accumulatedPayment")}
                  variant="h6"
                  component="h6"
                  sx={{ flexGrow: 1,display: "flex", gap: 2, flexWrap: "wrap" }}
                  fontWeight={900}
                >
                  {accumulatedPayment.paymentMethodName}:
                 
                 <Typography variant="h6" component="h6">
                 S/.{" "}{accumulatedPayment.totalAmount.toFixed(2)}
                  </Typography>

                </Typography>
              ))}
            </>
          ) : (
            <Typography variant="h6" component="h6">
              No hay ventas acumuladas
            </Typography>
          )}

          {/* <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" component="h6">
              Efectivo: S/. 200.00
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" component="h6">
              Tarjeta: S/. 200.00
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" component="h6">
              Yape: S/. 200.00
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" component="h6">
              Plin: S/. 200.00
            </Typography>
          </Box> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", width: "100%", gap: 2, flexWrap: "wrap" }}>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            color="error"
            size="large"
            onClick={closeModal}
          >
            Cancelar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SalesDataTable;
