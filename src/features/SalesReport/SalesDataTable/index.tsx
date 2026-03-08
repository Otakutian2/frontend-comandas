import dayjs from "dayjs";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import DataTable from "@/components/DataTable";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { IAccumulatedPayment, ISalesDataPerDate, IDishSoldData, IExtraSoldData, IDishPaymentMethodTotal } from "@/interfaces/IReceiptReport";
import { ramdonKey } from "@/utils";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { use, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { fetchAll } from "@/services";
import { IPaymentMethodGet } from "@/interfaces";
interface ISalesDataTableProps {
  data: ISalesDataPerDate[];
  paymentMethodData: IPaymentMethodGet[];
}



const SalesDataTable = ({ data, paymentMethodData }: ISalesDataTableProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [accumulatedPayment, setAccumulatedPayment] = useState<
    IAccumulatedPayment[]
  >([]);

  const [openDishesModal, setOpenDishesModal] = useState(false);
  const [soldDishes, setSoldDishes] = useState<IDishSoldData[]>([]);
  const [soldExtras, setSoldExtras] = useState<IExtraSoldData[]>([]);
  const [selectedRowDate, setSelectedRowDate] = useState<Date | null>(null);

  const closeModal = () => {
    setOpenModal(false);
    setAccumulatedPayment([]);
  };

  const closeDishesModal = () => {
    setOpenDishesModal(false);
    setSoldDishes([]);
    setSoldExtras([]);
    setSelectedRowDate(null);
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
      field: "quantityOfExtrasSold",
      headerName: "Cantidad de Extras Vendidos",
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
          // <GridActionsCellItem
          //   key="view-details"
          //   icon={
          //     <Box
          //       sx={{
          //         display: "flex",
          //         bgcolor: "primary.main",
          //         justifyContent: "center",
          //         alignItems: "center",
          //         color: "white",
          //         padding: "0.5rem 0.7rem",
          //         borderRadius: 1,
          //       }}
          //     >
          //       <VisibilityIcon />
          //     </Box>
          //   }
          //   label="Ver Detalles de la Venta"
          //   color="primary"
          //   onClick={() => {
          //     setOpenModal(true);
          //     setAccumulatedPayment(fa.row.accumulatedPaymentsByDays);
          //   }}
          // />,
          <GridActionsCellItem
            key="view-dishes"
            icon={
              <Box
                sx={{
                  display: "flex",
                  bgcolor: "secondary.main",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  padding: "0.5rem 0.7rem",
                  borderRadius: 1,
                }}
              >
                <RestaurantIcon />
              </Box>
            }
            label="Ver Platos Vendidos"
            color="secondary"
            onClick={() => {
              setOpenDishesModal(true);
              setSoldDishes(fa.row.soldDishes || []);
              setSoldExtras(fa.row.soldExtras || []);
              setSelectedRowDate(fa.row.createdAt);
            }}
          />,
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
     {openDishesModal && DialogDishesModal(
       openDishesModal, 
       closeDishesModal, 
       soldDishes, 
       soldExtras, 
       paymentMethodData, 
       selectedRowDate
     )}
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

const DialogDishesModal = (
  openModal: boolean,
  closeModal: () => void,
  soldDishes: IDishSoldData[],
  soldExtras: IExtraSoldData[],
  paymentMethodData: IPaymentMethodGet[],
  rowDate: Date | null
) => {
  const normalizedPlatos = soldDishes?.map((d) => ({
    id: d.dishId,
    name: d.dishName,
    quantity: d.quantity,
    unitPrice: d.unitPrice,
    totalAmount: d.totalAmount,
    paymentMethodTotals: d.paymentMethodTotals,
  })) || [];

  const normalizedExtras = soldExtras?.map((e) => ({
    id: e.extraId,
    name: e.extraName,
    quantity: e.quantity,
    unitPrice: e.unitPrice,
    totalAmount: e.totalAmount,
    paymentMethodTotals: e.paymentMethodTotals,
  })) || [];


  const getPaymentMethodAmountById = (
    paymentMethodTotals: IDishPaymentMethodTotal[],
    methodId: number
  ): number => {
    const payment = paymentMethodTotals?.find(
      (pm) => pm.paymentMethodId === methodId
    );
    return payment ? payment.amount : 0;
  };

  const renderTable = (
    items: {
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      totalAmount: number;
      paymentMethodTotals: IDishPaymentMethodTotal[];
    }[],
    isExtra: boolean = false
  ) => {
    if (items.length === 0) return null;

    return (
      <TableContainer component={Paper} sx={{ mb: 4 }} elevation={0} variant="outlined">
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>{isExtra ? "Extra" : "Plato"}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Cant</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Precio</TableCell>
              {paymentMethodData.map((pm) => (
                <TableCell key={ramdonKey("pm-header")} align="right" sx={{ fontWeight: "bold" }}>
                  {pm.name}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={ramdonKey(item.id)}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{item.unitPrice.toFixed(2)}</TableCell>
                {paymentMethodData.map((pm) => (
                  <TableCell key={ramdonKey("pm-cell")} align="right">
                    {getPaymentMethodAmountById(item.paymentMethodTotals, pm.id).toFixed(2)}
                  </TableCell>
                ))}
                <TableCell align="right">{item.totalAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            
            {/* Totals Row */}
            <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
              <TableCell colSpan={2} />
              <TableCell align="right" sx={{ fontWeight: "bold" }}>TOTAL:</TableCell>
              {paymentMethodData.map((pm) => {
                const totalPorPm = items.reduce(
                  (acc, item) => acc + getPaymentMethodAmountById(item.paymentMethodTotals, pm.id),
                  0
                );
                return (
                  <TableCell key={ramdonKey("pm-total")} align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    {totalPorPm.toFixed(2)}
                  </TableCell>
                );
              })}
              <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {items.reduce((acc, item) => acc + item.totalAmount, 0).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const wsData: any[][] = [];

    // Header styling
    const getHeaderStyle = (bgHex: string) => ({
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: bgHex } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    });

    const getColumnHeaderStyle = () => ({
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "E7E6E6" } }, // Lighter gray for columns
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    });

    const getRowStyle = (align: "left" | "center" | "right") => ({
      alignment: { horizontal: align, vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
      numFmt: align === "right" ? "0.00" : undefined, 
    });

    const headers = [
      "Nombre",
      "Cant",
      "Precio",
      ...paymentMethodData.map((pm) => pm.name),
      "Total",
    ];
    
    const merges: XLSX.Range[] = [];
    let currentRowIndex = 0;

    const appendSection = (title: string, items: any[]) => {
      // 1. Title Row
      const titleRow = Array(headers.length).fill("");
      titleRow[0] = { v: title, t: "s", s: getHeaderStyle("D9D9D9") };
      wsData.push(titleRow);

      merges.push({ s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex, c: headers.length - 1 } });
      currentRowIndex++;

      // 2. Col Headers row
      const headerRowCells = headers.map((h) => ({ v: h, t: "s", s: getColumnHeaderStyle() }));
      wsData.push(headerRowCells);
      currentRowIndex++;

      // 3. Data Rows
      items.forEach((item) => {
        const row = [];
        // Nombre
        row.push({ v: item.name, t: "s", s: getRowStyle("left") });
        // Cant
        row.push({ v: item.quantity, t: "n", s: getRowStyle("center") });
        // Precio
        row.push({ v: Number(item.unitPrice), t: "n", s: getRowStyle("right") });

        // Dynamic Payment methods
        paymentMethodData.forEach((pm) => {
          const amount = getPaymentMethodAmountById(item.paymentMethodTotals, pm.id);
          row.push({ v: Number(amount), t: "n", s: getRowStyle("right") });
        });

        // Total
        row.push({ v: Number(item.totalAmount), t: "n", s: getRowStyle("right") });

        wsData.push(row);
        currentRowIndex++;
      });

      // 4. Totals Row for the section
      const totalsRow = [];
      // Empty spaces for Name, Cant, Precio
      totalsRow.push({ v: "TOTAL", t: "s", s: getHeaderStyle("E7E6E6") });
      totalsRow.push({ v: "", t: "s" });
      totalsRow.push({ v: "", t: "s" });

      paymentMethodData.forEach((pm) => {
        const totalPorPm = items.reduce(
          (acc, item) => acc + getPaymentMethodAmountById(item.paymentMethodTotals, pm.id),
          0
        );
        totalsRow.push({ v: Number(totalPorPm), t: "n", s: { ...getRowStyle("right"), font: { bold: true, color: { rgb: "000000" } } } });
      });

      const grandTotal = items.reduce((acc, item) => acc + item.totalAmount, 0);
      totalsRow.push({ v: Number(grandTotal), t: "n", s: { ...getRowStyle("right"), font: { bold: true, color: { rgb: "000000" } } } });

      wsData.push(totalsRow);
      // Merge cells for TOTAL label to span across Nombre, Cant, Precio
      merges.push({ s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex, c: 2 } });
      currentRowIndex++;
    };

    if (normalizedPlatos.length > 0) {
      appendSection("PLATOS", normalizedPlatos);
    }

    if (normalizedExtras.length > 0) {
      if (wsData.length > 0) {
        // Leave 2 empty rows
        wsData.push(Array(headers.length).fill(""));
        wsData.push(Array(headers.length).fill(""));
        currentRowIndex += 2;
      }
      appendSection("EXTRAS", normalizedExtras);
    }

    // 5. Grand Total (Platos + Extras)
    if (normalizedPlatos.length > 0 || normalizedExtras.length > 0) {
      // Leave 2 empty rows before grand total
      wsData.push(Array(headers.length).fill(""));
      wsData.push(Array(headers.length).fill(""));
      currentRowIndex += 2;

      const grandTotalRow = [];
      grandTotalRow.push({ v: "TOTAL GENERAL", t: "s", s: getHeaderStyle("E7E6E6") }); // Grey background
      grandTotalRow.push({ v: "", t: "s" });
      grandTotalRow.push({ v: "", t: "s" });
      
      const textBlackStyle = { font: { bold: true, color: { rgb: "000000" } } };

      paymentMethodData.forEach((pm) => {
        const totalPlatos = normalizedPlatos.reduce((acc, item) => acc + getPaymentMethodAmountById(item.paymentMethodTotals, pm.id), 0);
        const totalExtras = normalizedExtras.reduce((acc, item) => acc + getPaymentMethodAmountById(item.paymentMethodTotals, pm.id), 0);
        const totalPmGral = totalPlatos + totalExtras;
        
        grandTotalRow.push({ 
          v: Number(totalPmGral), 
          t: "n", 
          s: { ...getRowStyle("right"), font: textBlackStyle.font } 
        });
      });

      const totalFinalGral = 
        normalizedPlatos.reduce((acc, item) => acc + item.totalAmount, 0) +
        normalizedExtras.reduce((acc, item) => acc + item.totalAmount, 0);

      grandTotalRow.push({ 
        v: Number(totalFinalGral), 
        t: "n", 
        s: { ...getRowStyle("right"), font: textBlackStyle.font } 
      });

      wsData.push(grandTotalRow);
      // Merge cells for TOTAL GENERAL label to span across Nombre, Cant, Precio
      merges.push({ s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex, c: 2 } });
      currentRowIndex++;
    }

    if (wsData.length === 0) {
      wsData.push([{ v: "No hay datos para exportar", t: "s" }]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    worksheet["!merges"] = merges;

    // Set some basic column widths
    const colWidths = [
      { wch: 30 }, // Nombre
      { wch: 10 }, // Cant
      { wch: 15 }, // Precio
      ...paymentMethodData.map(() => ({ wch: 15 })), // dinamyc PM
      { wch: 15 }, // Total
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    
    const formattedDate = rowDate ? dayjs(rowDate).format("DD-MM-YYYY") : dayjs().format("DD-MM-YYYY");
    saveAs(dataBlob, `Reporte_Platos_y_Extras_${formattedDate}.xlsx`);
  };

  return (
    <Dialog open={openModal} maxWidth="lg" fullWidth>
      <DialogTitle align="center" typography={"h6"} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ width: "100px" }} /> {/* Spacer */}
        <Box>Detalle de Platos y Extras Vendidos</Box>
        <Button
          variant="contained"
          color="success"
          onClick={handleExportExcel}
          disabled={normalizedPlatos.length === 0 && normalizedExtras.length === 0}
        >
          Exportar Excel
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {normalizedPlatos.length > 0 && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom fontWeight="bold" sx={{ mt: 1 }}>
                PLATOS
              </Typography>
              {renderTable(normalizedPlatos, false)}
            </Box>
          )}

          {normalizedExtras.length > 0 && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom fontWeight="bold" sx={{ mt: 1 }}>
                EXTRAS
              </Typography>
              {renderTable(normalizedExtras, true)}
            </Box>
          )}

          {normalizedPlatos.length === 0 && normalizedExtras.length === 0 && (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
              No hay platos ni extras vendidos registrados
            </Typography>
          )}

          {(normalizedPlatos.length > 0 || normalizedExtras.length > 0) && (
            <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <TableContainer component={Paper} sx={{ width: 'auto' }} elevation={0} variant="outlined">
                <Table size="small" aria-label="total de totales">
                  <TableBody>
                    <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: 'none', color: 'text.primary', pr: 4 }}>
                        TOTAL GENERAL:
                      </TableCell>
                      {paymentMethodData.map((pm) => {
                        const totalPlatos = normalizedPlatos.reduce((acc, item) => acc + getPaymentMethodAmountById(item.paymentMethodTotals, pm.id), 0);
                        const totalExtras = normalizedExtras.reduce((acc, item) => acc + getPaymentMethodAmountById(item.paymentMethodTotals, pm.id), 0);
                        const totalMethod = totalPlatos + totalExtras;
                        
                        return (
                          <TableCell key={ramdonKey("total-gral-pm")} align="right" sx={{ fontWeight: 'bold', minWidth: '90px', color: 'primary.main', borderBottom: 'none' }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.75rem", lineHeight: 1 }}>{pm.name}</Typography>
                            S/. {totalMethod.toFixed(2)}
                          </TableCell>
                        );
                      })}
                      <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: '120px', color: 'primary.main', borderLeft: '1px solid rgba(224, 224, 224, 1)', borderBottom: 'none', backgroundColor: "rgba(25, 118, 210, 0.04)" }}>
                        <Typography variant="caption" sx={{ color: "primary.main", display: "block", fontSize: "0.8rem", fontWeight: "bold", lineHeight: 1, mb: 0.5 }}>Total Final</Typography>
                        S/. {(
                          normalizedPlatos.reduce((acc, item) => acc + item.totalAmount, 0) +
                          normalizedExtras.reduce((acc, item) => acc + item.totalAmount, 0)
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={closeModal}
            sx={{ minWidth: 200 }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SalesDataTable;
