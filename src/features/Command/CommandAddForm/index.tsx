import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SmartScreenIcon from "@mui/icons-material/SmartScreen";
import PersonIcon from "@mui/icons-material/Person";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import React, { useEffect } from "react";
import { ITableGet } from "@/interfaces/ITable";
import {
  ICommandDetailsGet,
  ICommandGet,
  ICommandPrincipal,
} from "@/interfaces/ICommand";
import { ICurrentUser } from "@/interfaces/IUser";
import { Formik, FormikProps } from "formik";
import { createCommandSchemaDynamic } from "@/schemas/Command";
import { onlyNumber } from "@/utils";
import UserRoles from "@/interfaces/UserRoles";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { MenuItem } from "@mui/material";
import DiscountType from "@/enum/DiscountType";
interface CommandAddProps {
  table?: ITableGet | null;
  user: ICurrentUser;
  command: ICommandGet | null;
  // isTabledIdExist: boolean;
  // totalOrderPrice: number;
  customRef?: React.RefObject<FormikProps<ICommandPrincipal>>;
  saveCommand: () => void;
  commandDetailsCollection: ICommandDetailsGet[];
}

const CommandAddForm: React.FC<CommandAddProps> = ({
  table,
  command,
  user,
  // totalOrderPrice,
  customRef,
  saveCommand,
  commandDetailsCollection,
  // isTabledIdExist,
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

  if (!command) {
    if (!isTakeWay && tableId) {
      verifyCantSeat = true;
    } else {
      verifyCantSeat = false;
    }
  } else {
    verifyCantSeat =
      command?.seatCount !== null && command?.seatCount !== undefined;
  }

  const [totalCalculated, setTotalCalculated] = React.useState<number>(0);

  const getSubtotal = () => {
    let total = 0;
    commandDetailsCollection.forEach((detail) => {
      const totalOrderPrice = detail.dishPrice * detail.dishQuantity;

      total += totalOrderPrice;
      detail.extras.forEach((extra) => {
        let totalExtraPrice = extra.extraDish.price * extra.quantity;
        total += totalExtraPrice;
      });
    });
    return total;
  };

  const calculateDiscountedPrice = (
    originalPrice: number,
    discountValue: number,
    type : DiscountType
  ) => {
    const value = Number(discountValue) || 0;

    if (type === 'percentage') {
      return Math.max(0, originalPrice - originalPrice * (value / 100));
    } else if (type === 'amount') {
      return Math.max(0, originalPrice - value);
    }
    return originalPrice;
  };

  return (
    <Formik<ICommandPrincipal>
      initialValues={{
        seatCount: command?.seatCount || 1,
        customerAnonymous: command?.customerAnonymous || "",
        discountType: command?.discountType || "none",
        discount: command?.discount || 0,
      }}
      innerRef={customRef}
      validateOnChange={true}
      enableReinitialize={true}
      validationSchema={createCommandSchemaDynamic(maxSeatCount, getSubtotal())}
      onSubmit={() => {
        saveCommand();
      }}
    >
      {({
        values,
        errors,
        handleChange,
        isSubmitting,
        handleSubmit,
        setFieldValue,
        setValues,
      }) => {
        useEffect(() => {
          const subtotal = getSubtotal();

          const finalPrice = calculateDiscountedPrice(
            subtotal,
            values.discount || 0,
            values.discountType!
          );

          setTotalCalculated(finalPrice);
        }, [commandDetailsCollection, values.discount, values.discountType]);

        return (
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

              <Grid hidden={verifyCantSeat} item xs={12} sm={12}>
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

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  id="discountType"
                  name="discountType"
                  label="Tipo de Descuento"
                  value={values.discountType}
                  onChange={(e) => {
                    const newType = e.target.value;

                    if (newType === "none") {
                      setValues({
                        ...values, 
                        discountType: "none",
                        discount: 0, 
                      });

                    } else {
                      setFieldValue("discountType", newType);
                    }
                  }}
                  error={Boolean(errors.discountType)}
                  helperText={errors.discountType}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOfferIcon color="primary" />
                      </InputAdornment>
                    ),
                    readOnly: !canManageCommand,
                  }}
                  disabled={isSubmitting}
                  fullWidth
                >
                  <MenuItem value="none">Ninguno</MenuItem>
                  <MenuItem value="amount"> (S/.)</MenuItem>
                  <MenuItem value="percentage">(%)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  id="discount"
                  label="Descuento (valor)"
                  name="discount"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  value={values.discount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue("discount", val === "" ? 0 : Number(val));
                  }}
                  onFocus={(event) => event.target.select()}
                  error={Boolean(errors.discount)}
                  onKeyDown={onlyNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceChangeIcon color="secondary" />
                      </InputAdornment>
                    ),
                    readOnly: !canManageCommand,
                  }}
                  disabled={isSubmitting}
                  helperText={errors.discount}
                  fullWidth={true}
                />
              </Grid>

              {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{
                    mt: 0,
                    pt: 0,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DiscountIcon />}
                    onClick={() => {
                    }}
                    disabled={isSubmitting || !canManageCommand}
                    fullWidth={true}
                  >
                    Aplicar Descuento
                  </Button>
                </Grid> */}

              <Grid item xs={12} sm={12}>
                <TextField
                  label={
                    values.discountType === "none"
                      ? "Total"
                      : "Total con Descuento"
                  }
                  value={totalCalculated.toFixed(2)}
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
        );
      }}
    </Formik>
  );
};

export default CommandAddForm;
