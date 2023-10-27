import Box from "@mui/material/Box";
import { MutableRefObject } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { styled } from "@mui/material/styles";

interface IDataTableProps<T> {
  rows: T[] | undefined;
  columns: GridColDef[];
  getRowId?: GridRowIdGetter<any>;
  rowHeight?: number;
  apiRef?: MutableRefObject<GridApiCommunity>;
  height?: number | string;
  toolbar?: boolean;
}

const DataGridStyleCustom = styled(DataGrid)(({ theme }) => ({
  "&": {
    border: "none",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "rgb(248, 249, 250)",
    textTransform: "uppercase",
    fontSize: "12px",
    lineHeight: "1 !important",
    borderWidth: "thin",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "600",
  },
  "& .MuiDataGrid-withBorderColor": {
    borderColor: "rgb(242, 244, 247)",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(17, 25, 39, 0.04)",
  },
}));

const DataTable = <T,>({
  rows,
  columns,
  getRowId,
  rowHeight,
  apiRef,
  toolbar = true,
  height = "522px",
}: IDataTableProps<T>) => {
  const toolbarProps = toolbar
    ? {
        slots: { toolbar: GridToolbar },
        slotProps: { toolbar: { csvOptions: { utf8WithBom: true } } },
      }
    : {};

  return (
    <>
      <Box
        sx={{
          marginTop: 2,
          height: { height },
          display: "grid",
        }}
      >
        <DataGridStyleCustom
          sx={{
            minWidth: "100%",
          }}
          apiRef={apiRef}
          {...toolbarProps}
          rows={(rows || []) as GridValidRowModel[]}
          columns={columns}
          rowHeight={rowHeight || 75}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          getRowId={getRowId}
          disableRowSelectionOnClick
          pageSizeOptions={[5]}
        />
      </Box>
    </>
  );
};

export default DataTable;
