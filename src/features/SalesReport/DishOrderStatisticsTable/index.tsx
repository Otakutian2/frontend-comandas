import {
  GridColDef,
  GridValueFormatterParams,
  GridCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import DataTable from "@/components/DataTable";
import { IDishOrderStatistics } from "@/interfaces/IDish";
import ImageView from "@/components/ImageView";

interface IDishOrderStatisticsTableProps {
  data: IDishOrderStatistics[];
}

const DishOrderStatisticsTable = ({ data }: IDishOrderStatisticsTableProps) => {
  const columns: GridColDef[] = [
    {
      field: "dishId",
      headerName: "ID",
      minWidth: 100,
      sortable: false,
      flex: 1,
    },
    {
      field: "imageDish",
      headerName: "Imagen",
      minWidth: 150,
      sortable: false,
      filterable: false,
      flex: 2,
      renderCell: (params: GridCellParams<IDishOrderStatistics>) => (
        <ImageView image={params.row.imgDish} />
      ),
      valueGetter: (params: GridValueGetterParams<IDishOrderStatistics>) =>
        params.row.imgDish,
    },
    {
      field: "name",
      headerName: "Plato",
      minWidth: 200,
      sortable: false,
      flex: 3,
    },
    {
      field: "category",
      headerName: "Categoría",
      sortable: false,
      minWidth: 200,
      flex: 3,
    },
    {
      field: "totalSales",
      headerName: "Venta Total",
      type: "number",
      headerAlign: "left",
      align: "left",
      sortable: false,
      minWidth: 160,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `S/. ${(params.value as number).toFixed(2)}`;
      },
    },
    {
      field: "quantityOfDishesSold",
      headerName: "Cantidad Vendidas",
      type: "number",
      headerAlign: "left",
      sortable: false,
      align: "left",
      minWidth: 150,
      flex: 1,
    },
  ];

  return (
    <>
      <DataTable
        rowHeight={130}
        columns={columns}
        rows={data}
        getRowId={(row) => row.dishId}
      />
    </>
  );
};

export default DishOrderStatisticsTable;
