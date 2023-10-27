import Title from "@/components/Title";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React from "react";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import InputAdornment from "@mui/material/InputAdornment";
import { onlyDecimal, roundDecimal } from "@/utils";
import { Formik } from "formik";
import {
  receiptAddAdditionalAmountSchema,
  receiptAddDiscountSchema,
} from "@/schemas/Receipt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { IReceiptInfo } from "@/interfaces/IReceipt";
import { showErrorMessage } from "@/lib";

interface ReceiptAddDiscountAndAdditionalAmountProps {
  receiptDetails: IReceiptInfo;
  setReceiptDetails: React.Dispatch<React.SetStateAction<IReceiptInfo>>;
  loadingSubmit: boolean;
}

const ReceiptAddDiscountAndAdditionalAmount: React.FC<
  ReceiptAddDiscountAndAdditionalAmountProps
> = ({ receiptDetails, setReceiptDetails, loadingSubmit }) => {
  const theme = useTheme();

  return (
    <Box>
      <Title
        sx={{
          fontSize: "1.5rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          color: theme.palette.grey[700],
        }}
        variant="h2"
      >
        MONTO ADICIONAL Y DESCUENTO
      </Title>

      <Grid container columnSpacing={4} rowSpacing={4}>
        <Formik
          initialValues={{
            additionalAmount: 0,
          }}
          validateOnChange={false}
          validationSchema={receiptAddAdditionalAmountSchema}
          onSubmit={({ additionalAmount }, { resetForm }) => {
            const additionalAmountRounded = roundDecimal(additionalAmount);

            setReceiptDetails((prev) => ({
              ...prev,
              additionalAmount: prev.additionalAmount + additionalAmountRounded,
            }));
            resetForm();
          }}
        >
          {({
            values,
            errors,
            handleChange,
            isSubmitting,
            handleSubmit,
            resetForm,
          }) => (
            <>
              <Grid item xs={12} sm={6}>
                <form onSubmit={handleSubmit} id="form-add-additional-amout">
                  <TextField
                    id="additionalAmount"
                    type="number"
                    label="Monto Adicional"
                    error={!!errors.additionalAmount}
                    value={values.additionalAmount}
                    onChange={handleChange}
                    onKeyDown={onlyDecimal}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon color="primary" />
                        </InputAdornment>
                      ),
                      componentsProps: { input: { min: 0, step: "any" } },
                    }}
                    helperText={errors.additionalAmount}
                    disabled={isSubmitting || loadingSubmit}
                    fullWidth={true}
                  />
                </form>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "start",
                  },
                }}
              >
                <Tooltip
                  title="Añadir monto adicional"
                  placement="bottom"
                  arrow
                >
                  <IconButton
                    color="primary"
                    size="large"
                    type="submit"
                    form="form-add-additional-amout"
                    disabled={isSubmitting || loadingSubmit}
                  >
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title="Vaciar monto adicional"
                  placement="bottom"
                  arrow
                >
                  <IconButton
                    color="error"
                    size="large"
                    disabled={isSubmitting || loadingSubmit}
                    onClick={() => {
                      if (
                        receiptDetails.amountDue -
                          receiptDetails.additionalAmount <
                        0
                      ) {
                        showErrorMessage({
                          title: "Error al vaciar monto adicional",
                          contentHtml:
                            "No se puede vaciar monto adicional, debido a un conflito con el pago restante, intenta vaciar el descuento o los métodos de pagos",
                        });

                        return;
                      }

                      setReceiptDetails((prev) => ({
                        ...prev,
                        additionalAmount: 0,
                      }));
                      resetForm();
                    }}
                  >
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </>
          )}
        </Formik>

        <Formik
          initialValues={{
            discount: 0,
          }}
          validateOnChange={false}
          validationSchema={receiptAddDiscountSchema}
          onSubmit={(
            { discount },
            { resetForm, setFieldError, setSubmitting }
          ) => {
            const discountRounded = roundDecimal(discount);

            if (receiptDetails.total - discountRounded < 0) {
              setSubmitting(false);
              return setFieldError(
                "discount",
                "El descuento no puede ser mayor al total"
              );
            }

            if (receiptDetails.amountDue - discount < 0) {
              setSubmitting(false);
              return setFieldError(
                "discount",
                "No se puede aplicar descuento debido a que supera el pago restante"
              );
            }

            if (receiptDetails.amountDue === 0) {
              setSubmitting(false);
              return setFieldError(
                "discount",
                "No se puede aplicar descuento porque el pago ya está completo"
              );
            }

            setReceiptDetails((prev) => ({
              ...prev,
              discount: prev.discount + discountRounded,
            }));

            resetForm();
          }}
        >
          {({
            values,
            errors,
            handleChange,
            isSubmitting,
            handleSubmit,
            resetForm,
          }) => (
            <>
              <Grid item xs={12} sm={6}>
                <form onSubmit={handleSubmit} id="form-add-discount">
                  <TextField
                    id="discount"
                    type="number"
                    label="Descuento"
                    error={!!errors.discount}
                    value={values.discount}
                    onChange={handleChange}
                    onKeyDown={onlyDecimal}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon color="primary" />
                        </InputAdornment>
                      ),
                      componentsProps: { input: { min: 0, step: "any" } },
                    }}
                    helperText={errors.discount}
                    disabled={isSubmitting || loadingSubmit}
                    fullWidth={true}
                  />
                </form>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "start",
                  },
                }}
              >
                <Tooltip title="Añadir descuento" placement="bottom" arrow>
                  <IconButton
                    color="primary"
                    size="large"
                    type="submit"
                    form="form-add-discount"
                    disabled={isSubmitting || loadingSubmit}
                  >
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Vaciar descuento" placement="bottom" arrow>
                  <IconButton
                    color="error"
                    size="large"
                    onClick={() => {
                      setReceiptDetails((prev) => ({
                        ...prev,
                        discount: 0,
                      }));
                      resetForm();
                    }}
                    disabled={isSubmitting || loadingSubmit}
                  >
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </>
          )}
        </Formik>
      </Grid>
    </Box>
  );
};

export default ReceiptAddDiscountAndAdditionalAmount;
