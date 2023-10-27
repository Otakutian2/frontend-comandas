import Delete from "@mui/icons-material/Delete";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import Person from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import DataTable from "@/components/DataTable";
import EmployeeUpdateForm from "@/features/Employee/EmployeeUpdateForm";
import dayjs from "dayjs";
import {
  useGridApiRef,
  GridActionsCellItem,
  GridValueGetterParams,
  GridRowParams,
  GridColDef,
} from "@mui/x-data-grid";
import { IEmployeeCreateOrUpdate, IEmployeeGet } from "@/interfaces/IEmployee";
import { deleteObject, getObject } from "@/services/HttpRequests";
import { handleLastPageDeletion } from "@/utils";
import { useSWRConfig } from "swr";
import { showForm } from "@/lib/Forms";
import { showErrorMessage, showSuccessToastMessage } from "@/lib/Messages";
import { FormikProps } from "formik";
import { IRoleGet } from "@/interfaces/IRole";
import { useUserStore } from "@/store/user";
import { useRef } from "react";

interface IEmpoyeeTableProps {
  data: IEmployeeGet[];
  roles: IRoleGet[];
}

const EmployeeTable = ({ data, roles }: IEmpoyeeTableProps) => {
  const formikRef = useRef<FormikProps<IEmployeeCreateOrUpdate>>(null);
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const { mutate } = useSWRConfig();

  const gridApiRef = useGridApiRef();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100, flex: 1 },
    { field: "firstName", headerName: "Nombres", minWidth: 200, flex: 2 },
    { field: "lastName", headerName: "Apellidos", minWidth: 200, flex: 2 },
    { field: "dni", headerName: "DNI", minWidth: 100, flex: 2 },
    {
      field: "role",
      headerName: "Rol",
      type: "singleSelect",
      minWidth: 120,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<IEmployeeGet>) =>
        params.row.role.id,
      valueOptions: roles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
    },
    { field: "phone", headerName: "Teléfono", minWidth: 100, flex: 2 },
    {
      field: "email",
      headerName: "Correo Electrónico",
      minWidth: 200,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<IEmployeeGet>) =>
        params.row.user.email,
    },
    {
      field: "createdAt",
      headerName: "Creado en",
      type: "dateTime",
      minWidth: 160,
      flex: 2,
      valueGetter: (params: GridValueGetterParams<IEmployeeGet>) =>
        dayjs(params.row.createdAt).toDate(),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      minWidth: 100,
      flex: 1,
      getActions: (employee: GridRowParams<IEmployeeGet>) => {
        const gridCells = [
          <GridActionsCellItem
            key={employee.row.id}
            icon={<Edit />}
            label="Edit"
            color="warning"
            onClick={() => {
              showForm({
                title: "Actualizar Empleado",
                cancelButtonText: "CANCELAR",
                confirmButtonText: "ACTUALIZAR",
                customClass: {
                  confirmButton: "custom-confirm custom-confirm-update",
                },
                icon: (
                  <Person
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
                  <EmployeeUpdateForm
                    customRef={formikRef}
                    values={employee.row}
                    data={roles}
                    isUserInSession={user?.id === employee.row.id}
                    refreshUser={async () => {
                      fetchUser();
                    }}
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
        ];

        if (user?.id !== employee.row.id) {
          gridCells.push(
            <GridActionsCellItem
              key={employee.row.id}
              icon={<Delete />}
              label="Delete"
              color="error"
              onClick={async () => {
                const count = await getObject<number>(
                  `api/Employee/${employee.id}/number-commands`
                );

                if (count > 0) {
                  showErrorMessage({
                    title: `NO SE PUEDE ELIMINAR EL EMPLEADO - ${employee.id}`,
                    contentHtml: `No es posible eliminar el empleado debido a que se encontró ${count} comanda${
                      count !== 1 ? "s" : ""
                    } asignado a dicho empleado.`,
                  });

                  return;
                }

                showForm({
                  title: "Eliminar Empleado",
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
                      ¿Estás seguro de eliminar el empleado{" "}
                      {`"${employee.row.firstName} ${employee.row.lastName}"`}?
                    </Typography>
                  ),
                  preConfirm: async () => {
                    await deleteObject(`api/employee/${employee.id}`);
                    handleLastPageDeletion(gridApiRef, data.length);
                    mutate("api/employee");

                    showSuccessToastMessage(
                      "El empleado se ha eliminado correctamente"
                    );
                  },
                });
              }}
            />
          );
        }

        return gridCells;
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={data} apiRef={gridApiRef} />
    </>
  );
};

export default EmployeeTable;
