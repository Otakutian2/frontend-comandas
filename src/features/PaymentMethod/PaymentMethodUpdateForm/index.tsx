import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import paymentMethodSchema from "@/schemas/PaymentMethod";
import Swal from "sweetalert2";
import {
  IPaymentMethodGet,
  IPaymentMethodPrincipal,
} from "@/interfaces/IPaymentMethod";
import { IUpdateFormProps } from "@/interfaces/IFormProps";
import { useSWRConfig } from "swr";
import { updateObject } from "@/services/HttpRequests";
import { Formik } from "formik";
import { theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";
import { AxiosError } from "axios";

const PaymentMethodUpdateForm = ({
  customRef,
  values,
}: IUpdateFormProps<IPaymentMethodPrincipal, IPaymentMethodGet>) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<IPaymentMethodPrincipal>
        initialValues={{
          ...values,
        }}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={paymentMethodSchema}
        onSubmit={async (paymentMethodUpdate) => {
          try {
            await updateObject<IPaymentMethodGet, IPaymentMethodPrincipal>(
              `api/PaymentMethod/${values.id}`,
              paymentMethodUpdate
            );
            mutate("api/PaymentMethod");

            showSuccessToastMessage(
              "El método de pago se ha modificado correctamente"
            );
          } catch (err) {
            const error = err as AxiosError;
            Swal.showValidationMessage(error.response?.data as string);
          }
        }}
      >
        {({ values, errors, handleChange, isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5} marginY={2}>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  type="text"
                  label="Método de Pago"
                  error={Boolean(errors.name)}
                  value={values.name}
                  onChange={handleChange}
                  helperText={errors.name}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </ThemeProvider>
  );
};

export default PaymentMethodUpdateForm;
