import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import establishmentSchema from "@/schemas/Establishment";
import {
  IEstablishmentPrincipal,
  IEstablishmentGet,
} from "@/interfaces/IEstablishment";
import { updateObject } from "@/services/HttpRequests";
import { useFormik } from "formik";
import { useSWRConfig } from "swr";
import { showSuccessToastMessage } from "@/lib/Messages";
import { onlyNumber } from "@/utils";

interface IEstablishmentUpdateFormProps {
  establishment: IEstablishmentGet;
}

const EstablishmentUpdateForm = ({
  establishment,
}: IEstablishmentUpdateFormProps) => {
  const { mutate } = useSWRConfig();

  const formik = useFormik<IEstablishmentPrincipal>({
    initialValues: {
      name: establishment.name,
      address: establishment.address,
      phone: establishment.phone,
      ruc: establishment.ruc,
    },
    validationSchema: establishmentSchema,
    onSubmit: async (establishmentUpdate) => {
      await updateObject<IEstablishmentGet, IEstablishmentPrincipal>(
        `api/establishment/${establishment.id}`,
        establishmentUpdate
      );
      mutate("api/establishment/first");

      showSuccessToastMessage(
        "El establecimiento se ha actualizado correctamente"
      );
    },
    validateOnChange: false,
  });

  return (
    <Box sx={{ paddingY: 1 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: { sx: "start", sm: "end" } }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              id="name"
              type="text"
              label="Nombre del Establecimiento"
              error={Boolean(formik.errors.name)}
              value={formik.values.name}
              onChange={formik.handleChange}
              helperText={formik.errors.name}
              disabled={formik.isSubmitting}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="address"
              type="text"
              label="Dirección"
              error={Boolean(formik.errors.address)}
              value={formik.values.address}
              onChange={formik.handleChange}
              helperText={formik.errors.address}
              disabled={formik.isSubmitting}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="phone"
              type="text"
              label="Teléfono"
              error={Boolean(formik.errors.phone)}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onKeyDown={onlyNumber}
              helperText={formik.errors.phone}
              disabled={formik.isSubmitting}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="ruc"
              type="text"
              label="RUC"
              error={Boolean(formik.errors.ruc)}
              value={formik.values.ruc}
              onChange={formik.handleChange}
              onKeyDown={onlyNumber}
              helperText={formik.errors.ruc}
              disabled={formik.isSubmitting}
              fullWidth
            />
          </Grid>

          <Grid item container xs={12} sm={"auto"}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              disabled={formik.isSubmitting}
              onClick={() => formik.handleSubmit()}
              fullWidth
            >
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EstablishmentUpdateForm;
