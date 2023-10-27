import Grid from "@mui/material/Grid";
import ComboBox from "@/components/ComboBox";
import cashSchema from "@/schemas/Cash";
import { ICashGet, ICashPrincipal } from "@/interfaces/ICash";
import { IEstablishmentGet } from "@/interfaces/IEstablishment";
import { IUpdateFormProps } from "@/interfaces/IFormProps";
import { useSWRConfig } from "swr";
import { updateObject } from "@/services/HttpRequests";
import { Formik } from "formik";
import { theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";

const CashUpdateForm = ({
  customRef,
  values: cash,
}: IUpdateFormProps<ICashPrincipal, ICashGet>) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<ICashPrincipal>
        initialValues={{
          establishmentId: cash.establishment.id,
        }}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={cashSchema}
        onSubmit={async (cashUpdate) => {
          await updateObject<ICashGet, ICashPrincipal>(
            `api/cash/${cash.id}`,
            cashUpdate
          );
          mutate("api/cash");

          showSuccessToastMessage("La caja se ha modificado correctamente");
        }}
      >
        {({ errors, setFieldValue, isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5} marginY={2}>
              <Grid item xs={12}>
                <ComboBox
                  id="id"
                  label="name"
                  value={cash.establishment}
                  values={[cash.establishment]}
                  handleChange={(establishment: IEstablishmentGet | null) => {
                    setFieldValue("establishmentId", establishment?.id);
                  }}
                  textFieldProps={{
                    label: "Establecimiento",
                    error: Boolean(errors.establishmentId),
                    helperText: errors.establishmentId,
                    disabled: isSubmitting,
                  }}
                />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </ThemeProvider>
  );
};

export default CashUpdateForm;
