import ComboBox from "@/components/ComboBox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import cashSchema from "@/schemas/Cash";
import { useSWRConfig } from "swr";
import { createObject } from "@/services/HttpRequests";
import { IEstablishmentGet } from "@/interfaces/IEstablishment";
import { IFormProps } from "@/interfaces/IFormProps";
import { ICashPrincipal, ICashGet } from "@/interfaces/ICash";
import { Formik } from "formik";
import { theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";

interface ICashAddFormProps extends IFormProps<ICashPrincipal> {
  establishment: IEstablishmentGet;
}

const CashAddForm = ({ customRef, establishment }: ICashAddFormProps) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<ICashPrincipal>
        initialValues={{
          establishmentId: establishment.id,
        }}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={cashSchema}
        onSubmit={async (newCash) => {
          await createObject<ICashGet, ICashPrincipal>("api/cash", newCash);
          mutate("api/cash");

          showSuccessToastMessage("La caja se ha registrado correctamente");
        }}
      >
        {({ errors, setFieldValue, handleSubmit }) => (
          <>
            <Typography>¿Estás seguro de agregar una caja?</Typography>

            <form onSubmit={handleSubmit} style={{ display: "none" }}>
              <Grid container spacing={1.5} marginY={2}>
                <Grid item xs={12}>
                  <ComboBox
                    id="id"
                    label="name"
                    value={establishment}
                    values={[establishment]}
                    handleChange={(establishment: IEstablishmentGet | null) => {
                      setFieldValue("establishmentId", establishment?.id);
                    }}
                    disabled={true}
                    textFieldProps={{
                      label: "Establecimiento",
                      error: Boolean(errors.establishmentId),
                      helperText: errors.establishmentId,
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </>
        )}
      </Formik>
    </ThemeProvider>
  );
};

export default CashAddForm;
