import Title from "@/components/Title";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import InputAdornment from "@mui/material/InputAdornment";
import { onlyDecimal, roundDecimal } from "@/utils";
import ComboBox from "@/components/ComboBox";
import { IPaymentMethodGet } from "@/interfaces";
import { Formik } from "formik";
import { receiptAddAmountSchema } from "@/schemas/Receipt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { findImage } from "@/sections/ReceiptSection";
import { IReceiptInfo } from "@/interfaces/IReceipt";
import ImageView from "@/components/ImageView";

interface ReceiptAddAmoutProps {
  receiptDetails: IReceiptInfo;
  setReceiptDetails: React.Dispatch<React.SetStateAction<IReceiptInfo>>;
  data?: IPaymentMethodGet[];
  isLoading: boolean;
  loadingSubmit: boolean;
}

const ReceiptAddAmout: React.FC<ReceiptAddAmoutProps> = ({
  receiptDetails,
  setReceiptDetails,
  data,
  isLoading,
  loadingSubmit,
}) => {
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
        AGREGAR PAGOS
      </Title>

      <Formik
        initialValues={{
          amount: 0.0,
          paymentMethodId: undefined,
        }}
        validateOnChange={false}
        validationSchema={receiptAddAmountSchema}
        onSubmit={(
          { amount, paymentMethodId },
          { resetForm, setFieldError, setSubmitting }
        ) => {
          console.log(receiptDetails.total);
          const existsPaymentMethod =
            receiptDetails.receiptDetailsCollection?.findIndex(
              (x) => x.paymentMethodId === paymentMethodId
            ) ?? -1;

          const amountAccumulated = roundDecimal(
            (receiptDetails.receiptDetailsCollection?.reduce(
              (acc, curr) => acc + curr.amount,
              0
            ) || 0) + amount
          );

          if (amountAccumulated > receiptDetails.total) {
            setSubmitting(false);
            return setFieldError(
              "amount",
              "El monto no puede ser mayor al total"
            );
          }

          setReceiptDetails((prev) => {
            const receiptDetailsCollection = [
              ...(prev.receiptDetailsCollection || []),
            ];

            if (existsPaymentMethod === -1) {
              receiptDetailsCollection.push({
                amount: roundDecimal(amount),
                paymentMethodId: paymentMethodId!,
              });
            } else {
              receiptDetailsCollection[existsPaymentMethod].amount +=
                roundDecimal(amount);
            }

            return { ...prev, receiptDetailsCollection };
          });

          resetForm();
        }}
      >
        {({
          values,
          errors,
          handleChange,
          isSubmitting,
          setFieldValue,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container columnSpacing={4} rowSpacing={4}>
              <Grid item xs={12} sm={6}>
                <ComboBox
                  id={"id"}
                  label={"name"}
                  values={data || []}
                  value={data?.find((x) => x.id === values.paymentMethodId)}
                  loading={isLoading}
                  handleChange={(paymentMethod: IPaymentMethodGet | null) => {
                    setFieldValue("paymentMethodId", paymentMethod?.id);
                  }}
                  disabled={isSubmitting || loadingSubmit}
                  textFieldProps={{
                    label: "Métodos de Pago",
                    error: Boolean(errors.paymentMethodId),
                    helperText: errors.paymentMethodId,
                  }}
                  renderOption={(props, option) => {
                    return (
                      <Box
                        component="li"
                        sx={{ "& > div": { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <ImageView
                          width={80}
                          height={50}
                          image={findImage(option.name)}
                        />
                        {option.name}
                      </Box>
                    );
                  }}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  id="amount"
                  type="number"
                  label="Monto"
                  error={Boolean(errors.amount)}
                  value={values.amount}
                  onChange={handleChange}
                  onKeyDown={onlyDecimal}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceChangeIcon color="primary" />
                      </InputAdornment>
                    ),
                    componentsProps: {
                      input: { min: 0, step: "any" },
                    },
                  }}
                  helperText={errors.amount}
                  disabled={isSubmitting || loadingSubmit}
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <Tooltip title="Añadir Pago" placement="bottom" arrow>
                  <IconButton
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={isSubmitting || loadingSubmit}
                  >
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ReceiptAddAmout;
