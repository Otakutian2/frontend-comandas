import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import paymentMethodSchema from "@/schemas/PaymentMethod";
import Swal from "sweetalert2";
import { useSWRConfig } from "swr";
import { createObject } from "@/services/HttpRequests";
import {
  IPaymentMethodGet,
  IPaymentMethodPrincipal,
} from "@/interfaces/IPaymentMethod";
import { IFormProps } from "@/interfaces/IFormProps";
import { Formik } from "formik";
import { theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";
import { AxiosError } from "axios";

const initialValues: IPaymentMethodPrincipal = {
  name: "",
};

const PaymentMethodAddForm = ({
  customRef,
}: IFormProps<IPaymentMethodPrincipal>) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<IPaymentMethodPrincipal>
        initialValues={initialValues}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={paymentMethodSchema}
        onSubmit={async (newPaymentMethod) => {
          try {
            await createObject<IPaymentMethodGet, IPaymentMethodPrincipal>(
              "api/PaymentMethod",
              newPaymentMethod
            );
            mutate("api/PaymentMethod");

            showSuccessToastMessage(
              "El método de pago se ha registrado correctamente"
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

export default PaymentMethodAddForm;
