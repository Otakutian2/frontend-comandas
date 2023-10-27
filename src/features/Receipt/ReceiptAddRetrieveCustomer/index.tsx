import Title from "@/components/Title";
import { IconButton, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import BadgeIcon from "@mui/icons-material/Badge";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Tooltip from "@mui/material/Tooltip";
import CustomerAddForm from "@/features/Customer/CustomerAddForm";
import useOpenClose from "@/hooks/useOpenClose";
import { IReceiptInfo } from "@/interfaces/IReceipt";
import Swal from "sweetalert2";
import { getObject } from "@/services";
import { ICustomerGet } from "@/interfaces";
import { showErrorMessage, showSuccessMessage } from "@/lib/Messages";
import { AxiosError } from "axios";

interface ReceiptAddRetrieveCustomerProps {
  receiptDetails: IReceiptInfo;
  setReceiptDetails: React.Dispatch<React.SetStateAction<IReceiptInfo>>;
  loadingSubmit: boolean;
}

const ReceiptAddRetrieveCustomer: React.FC<ReceiptAddRetrieveCustomerProps> = ({
  receiptDetails,
  setReceiptDetails,
  loadingSubmit,
}) => {
  const [dni, setDni] = useState<string>("");
  const [
    openCustomerAddForm,
    openCustomerAddFormDialog,
    closeCustomerAddFormDialog,
  ] = useOpenClose(false);
  const theme = useTheme();

  const fetchCustomer = async () => {
    Swal.fire({
      title: "Buscando Cliente ...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: async () => {
        Swal.showLoading();

        try {
          const data = await getObject<ICustomerGet>(`api/customer/dni/${dni}`);

          if (!data) {
            throw new Error("Cliente no encontrado");
          }

          setReceiptDetails((prev) => ({ ...prev, customer: data }));
          showSuccessMessage("Cliente encontrado con éxito");
        } catch (err) {
          if (err instanceof AxiosError) {
            const error = err as AxiosError;

            if (error.response?.status === 400) {
              showErrorMessage({ title: "El dni del cliente es requerido" });
              return;
            }
          }

          showErrorMessage({ title: "Cliente no encontrado" });
        }
      },
    });
  };

  const clearFields = () => {
    setDni("");
    setReceiptDetails((prev) => ({ ...prev, customer: null }));
  };

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
        DATOS DEL CLIENTE
      </Title>

      <Grid container columnSpacing={4} rowSpacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="dni"
            type="text"
            label="DNI"
            value={dni}
            onChange={(e) => {
              setDni(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PermIdentityIcon color="primary" />
                </InputAdornment>
              ),
              componentsProps: { input: { maxLength: 8 } },
            }}
            disabled={loadingSubmit}
            fullWidth={true}
          />
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
          <Tooltip title="Buscar Cliente" placement="bottom" arrow>
            <IconButton
              color="primary"
              size="large"
              onClick={fetchCustomer}
              disabled={loadingSubmit}
            >
              <PersonSearchIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Vaciar Campos" placement="bottom" arrow>
            <IconButton
              color="error"
              size="large"
              onClick={clearFields}
              disabled={loadingSubmit}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Registrar Cliente" placement="bottom" arrow>
            <IconButton
              color="primary"
              size="large"
              onClick={openCustomerAddFormDialog}
              disabled={loadingSubmit}
            >
              <PersonAddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="firstName"
            type="text"
            label="Nombres"
            value={receiptDetails.customer?.firstName || ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="primary" />
                </InputAdornment>
              ),
            }}
            disabled={true}
            fullWidth={true}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="lastName"
            type="text"
            label="Apellidos"
            value={receiptDetails.customer?.lastName || ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="primary" />
                </InputAdornment>
              ),
            }}
            disabled={true}
            fullWidth={true}
          />
        </Grid>
      </Grid>

      <CustomerAddForm
        open={openCustomerAddForm}
        closeDialog={closeCustomerAddFormDialog}
        setReceiptDetails={setReceiptDetails}
        setDni={setDni}
      />
    </Box>
  );
};

export default ReceiptAddRetrieveCustomer;
