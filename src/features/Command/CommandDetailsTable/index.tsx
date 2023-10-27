import DataTable from "@/components/DataTable";
import ImageView from "@/components/ImageView";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { showSuccessToastMessage } from "@/lib/Messages";
import { showForm } from "@/lib/Forms";
import Delete from "@mui/icons-material/Delete";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import Info from "@mui/icons-material/Info";
import Typography from "@mui/material/Typography";
import {
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
  GridValueGetterParams,
  useGridApiRef,
} from "@mui/x-data-grid";
import React from "react";
import { handleLastPageDeletion } from "@/utils";
import { useUserStore } from "@/store/user";
import UserRoles from "@/interfaces/UserRoles";

interface CommandDetailsTableProps {
  data: ICommandDetailsGet[];
  setCommandDetailsCollection: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet[]>
  >;
  setCommandDetailsSelected: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet | null>
  >;
  openUpdateFormDialog: () => void;
  openInformationFormDialog: () => void;
  loading: boolean;
}

const CommandDetailsTable: React.FC<CommandDetailsTableProps> = ({
  data,
  setCommandDetailsCollection,
  setCommandDetailsSelected,
  openUpdateFormDialog,
  openInformationFormDialog,
  loading,
}) => {
  const user = useUserStore((state) => state.user);
  const role = user?.role.name as UserRoles;

  const gridApiRef = useGridApiRef();

  const columns: GridColDef[] = [
    {
      field: "imageDish",
      headerName: "Imagen",
      minWidth: 150,
      sortable: false,
      filterable: false,
      flex: 3,
      renderCell: (params: GridCellParams<ICommandDetailsGet>) => (
        <ImageView image={params.row.dish.image} />
      ),
      valueGetter: (params: GridValueGetterParams<ICommandDetailsGet>) =>
        params.row.dish.image,
    },
    {
      field: "name",
      headerName: "Plato",
      minWidth: 200,
      flex: 3,
      valueGetter: (params: GridValueGetterParams<ICommandDetailsGet>) =>
        params.row.dish.name,
    },
    {
      field: "price",
      headerName: "Precio Unitario",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<ICommandDetailsGet>) =>
        params.row.dishPrice,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `S/. ${(params.value as number).toFixed(2)}`;
      },
    },
    {
      field: "category",
      headerName: "Categoría",
      type: "singleSelect",
      minWidth: 150,
      flex: 3,
      valueGetter: (params: GridValueGetterParams<ICommandDetailsGet>) =>
        params.row.dish.category.name,
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<ICommandDetailsGet>) =>
        params.row.dishQuantity,
    },
    {
      field: "totalPrice",
      headerName: "Precio Total",
      type: "number",
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<ICommandDetailsGet>) =>
        params.row.orderPrice,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `S/. ${(params.value as number).toFixed(2)}`;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      minWidth: 100,
      flex: 1,
      getActions: (commandDetails: GridRowParams<ICommandDetailsGet>) => {
        const gridActionsCell = [
          <GridActionsCellItem
            key={commandDetails.id}
            icon={<Info />}
            label="Information"
            color="primary"
            onClick={() => {
              setCommandDetailsSelected(commandDetails.row);
              openInformationFormDialog();
            }}
            disabled={loading}
          />,
        ];

        if (role === "Administrador" || role == "Mesero") {
          gridActionsCell.push(
            <GridActionsCellItem
              key={commandDetails.id}
              icon={<Edit />}
              label="Edit"
              color="warning"
              onClick={() => {
                setCommandDetailsSelected(commandDetails.row);
                openUpdateFormDialog();
              }}
              disabled={loading}
            />,
            <GridActionsCellItem
              key={commandDetails.id}
              icon={<Delete />}
              label="Delete"
              color="error"
              onClick={() => {
                showForm({
                  title: "Eliminar Plato de la Comanda",
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
                      ¿Estás seguro de eliminar el plato{" "}
                      {`"${commandDetails.row.dish.name}"`} de la comanda?
                    </Typography>
                  ),
                  preConfirm: async () => {
                    removeCommandDetails(commandDetails.row.dish.id);
                    handleLastPageDeletion(gridApiRef, data.length);
                    showSuccessToastMessage(
                      "El plato se ha removido de la comanda, asegúrate de guardarla"
                    );
                  },
                });
              }}
              disabled={loading}
            />
          );
        }

        return gridActionsCell;
      },
    },
  ];

  const removeCommandDetails = (id: string) => {
    setCommandDetailsCollection((prev) => {
      const collection = [...prev];
      return collection.filter((item) => item.dish.id !== id);
    });
  };

  return (
    <>
      <DataTable
        rowHeight={130}
        columns={columns}
        rows={data}
        toolbar={false}
        getRowId={(row) => row.dish.id}
        apiRef={gridApiRef}
      />
    </>
  );
};

export default CommandDetailsTable;
