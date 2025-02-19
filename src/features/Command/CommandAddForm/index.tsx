import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SmartScreenIcon from "@mui/icons-material/SmartScreen";
import PersonIcon from "@mui/icons-material/Person";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import React from "react";
import { ITableGet } from "@/interfaces/ITable";
import { ICommandGet, ICommandPrincipal } from "@/interfaces/ICommand";
import { ICurrentUser } from "@/interfaces/IUser";
import { Formik, FormikProps } from "formik";
import { createCommandSchemaDynamic } from "@/schemas/Command";
import { onlyNumber } from "@/utils";
import UserRoles from "@/interfaces/UserRoles";
import { useRouter } from "next/router";

interface CommandAddProps {
  table?: ITableGet | null;
  user: ICurrentUser;
  command: ICommandGet | null;
  isTabledIdExist: boolean;
  totalOrderPrice: number;
  customRef?: React.RefObject<FormikProps<ICommandPrincipal>>;
  saveCommand: () => void;
}

const CommandAddForm: React.FC<CommandAddProps> = ({
  table,
  command,
  user,
  totalOrderPrice,
  customRef,
  saveCommand,
  isTabledIdExist
}) => {
    
  const maxSeatCount =
    table?.seatCount || command?.tableRestaurant?.seatCount || 1;
  const role = user?.role.name as UserRoles;
  const canManageCommand = role === "Administrador" || role === "Mesero";
  const employeeName = command?.employee
    ? command.employee.firstName + " " + command.employee.lastName
    : user.firstName + " " + user.lastName;
  const router = useRouter();
  const isTakeWay = router.query?.type === "takeaway";
  const tableId = router.query?.tableId as string;
  let verifyCantSeat = false;

  if (!command)
  {
    if(!isTakeWay && tableId)
    {
      verifyCantSeat = true;
    }else{
      verifyCantSeat = false;
    }


  }else{
    verifyCantSeat  = command?.seatCount !== null && command?.seatCount !== undefined;
      
  }

    
 
    
  return (
    <Formik<ICommandPrincipal>
      initialValues={{
        seatCount: command?.seatCount || 1,
        customerAnonymous :  command?.customerAnonymous || "",

      }}
      innerRef={customRef}
      validateOnChange={false}
      validationSchema={createCommandSchemaDynamic(maxSeatCount)}
      onSubmit={() => {
        saveCommand();
      }}
    >
      {({ values, errors, handleChange, isSubmitting, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {(table || command?.tableRestaurant) && (
              <>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Número de Mesa"
                    type="text"
                    defaultValue={table?.id || command?.tableRestaurant.id}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TableRestaurantIcon color="primary" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    disabled={isSubmitting}
                    fullWidth={true}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    id="seatCount"
                    type="number"
                    label="Cantidad de Personas"
                    error={Boolean(errors.seatCount)}
                    value={values.seatCount}
                    onChange={handleChange}
                    onKeyDown={onlyNumber}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleAltIcon color="primary" />
                        </InputAdornment>
                      ),
                      componentsProps: {
                        input: { min: 1, max: maxSeatCount },
                      },
                      readOnly: !canManageCommand,
                    }}
                    disabled={isSubmitting}
                    helperText={errors.seatCount}
                    fullWidth={true}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={12}>
              <TextField
                label="Estado de la Comanda"
                value={command?.commandState.name || "Preparando"}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SmartScreenIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={isSubmitting}
                fullWidth={true}
              />
            </Grid>

            <Grid
            hidden={verifyCantSeat}
            item xs={12} sm={12}>
              <TextField
                id="customerAnonymous"
                label="Cliente"
                InputLabelProps={{ shrink: true }}
                value={values?.customerAnonymous}
                error={Boolean(errors.customerAnonymous)}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                  readOnly: !canManageCommand,
                }}
                disabled={isSubmitting}
                helperText={errors.customerAnonymous}
                fullWidth={true}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Empleado"
                defaultValue={employeeName}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={isSubmitting}
                fullWidth={true}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Precio Total"
                value={Number(totalOrderPrice).toFixed(2)}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PriceChangeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                disabled={isSubmitting}
                fullWidth={true}
              />
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default CommandAddForm;
