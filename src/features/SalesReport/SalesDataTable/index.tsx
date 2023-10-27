import dayjs from "dayjs";
import DataTable from "@/components/DataTable";
import {
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { ISalesDataPerDate } from "@/interfaces/IReceiptReport";

interface ISalesDataTableProps {
  data: ISalesDataPerDate[];
}

const SalesDataTable = ({ data }: ISalesDataTableProps) => {
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
  ];

  return (
    <>
      <DataTable
        rowHeight={130}
        columns={columns}
        rows={data}
        getRowId={(row) => row.createdAt}
      />
    </>
  );
};

export default SalesDataTable;
