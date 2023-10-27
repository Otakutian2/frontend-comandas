import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import customerCreateSchema from "@/schemas/Customer";
import Swal from "sweetalert2";
import { Formik } from "formik";
import { createObject } from "@/services/HttpRequests";
import { onlyNumber } from "@/utils";
import { showErrorMessage, showSuccessToastMessage } from "@/lib/Messages";
import { AxiosError } from "axios";
import { ICustomerGet, ICustomerPrincipal } from "@/interfaces/ICustomer";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BadgeIcon from "@mui/icons-material/Badge";
import InputAdornment from "@mui/material/InputAdornment";
import Title from "@/components/Title";
import LoaderComponent from "@/components/LoaderComponent";
import { IReceiptInfo } from "@/interfaces/IReceipt";
import React, { useState } from "react";

const initialValues: ICustomerPrincipal = {
  firstName: "",
  lastName: "",
  dni: "",
};

interface CustomerAddFormProps {
  open: boolean;
  closeDialog: () => void;
  setReceiptDetails: React.Dispatch<React.SetStateAction<IReceiptInfo>>;
  setDni: React.Dispatch<React.SetStateAction<string>>;
}

const CustomerAddForm: React.FC<CustomerAddFormProps> = ({
  open,
  closeDialog,
  setReceiptDetails,
  setDni,
}) => {
  const [messageError, setMessageError] = useState<string>("");

  return (
    <Formik<ICustomerPrincipal>
      initialValues={initialValues}
      validateOnChange={false}
      validationSchema={customerCreateSchema}
      onSubmit={async (newCustomer) => {
        try {
          const customer = await createObject<ICustomerGet, ICustomerPrincipal>(
            "api/customer",
            newCustomer
          );

          setMessageError("");
          setReceiptDetails((prev) => ({ ...prev, customer: customer }));
          setDni(customer.dni);
          closeDialog();
          showSuccessToastMessage("El cliente se ha registrado correctamente");
        } catch (err) {
          const error = err as AxiosError;
          setMessageError(error.response?.data as string);
        }
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
        <Dialog sx={{ zIndex: 1400 }} open={open} fullWidth maxWidth="xs">
          <DialogTitle>
            <Box sx={{ textAlign: "center" }}>
              <PersonAddIcon sx={{ fontSize: "5rem" }} color="primary" />

              <Title sx={{ mb: 0 }}>Agregar Cliente</Title>
            </Box>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} id="form-add-customer">
              {messageError && <Alert severity="error">{messageError}</Alert>}
              <Grid container spacing={1.5} marginY={2}>
                <Grid item xs={12}>
                  <TextField
                    id="dni"
                    type="text"
                    label="DNI"
                    error={Boolean(errors.dni)}
                    value={values.dni}
                    onChange={handleChange}
                    onKeyDown={onlyNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PermIdentityIcon color="primary" />
                        </InputAdornment>
                      ),
                      componentsProps: { input: { maxLength: 8 } },
                    }}
                    helperText={errors.dni}
                    disabled={isSubmitting}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="firstName"
                    type="text"
                    label="Nombres"
                    error={Boolean(errors.firstName)}
                    value={values.firstName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="primary" />
                        </InputAdornment>
                      ),
                      componentsProps: { input: { maxLength: 50 } },
                    }}
                    helperText={errors.firstName}
                    disabled={isSubmitting}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="lastName"
                    type="text"
                    label="Apellidos"
                    error={Boolean(errors.lastName)}
                    value={values.lastName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="primary" />
                        </InputAdornment>
                      ),
                      componentsProps: { input: { maxLength: 50 } },
                    }}
                    helperText={errors.lastName}
                    disabled={isSubmitting}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Box
              sx={{ display: "flex", width: "100%", gap: 2, flexWrap: "wrap" }}
            >
              <Button
                sx={{ flexGrow: 1 }}
                variant="contained"
                type="submit"
                form="form-add-customer"
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoaderComponent size="1.5rem" /> : "Agregar"}
              </Button>
              <Button
                sx={{ flexGrow: 1 }}
                variant="contained"
                color="error"
                disabled={isSubmitting}
                onClick={() => {
                  closeDialog();
                  setMessageError("");
                  resetForm();
                }}
              >
                Cancelar
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};

export default CustomerAddForm;
