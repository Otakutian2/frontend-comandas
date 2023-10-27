import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { tableCreateSchema } from "@/schemas/Table";
import { useSWRConfig } from "swr";
import { createObject } from "@/services/HttpRequests";
import { ITableGet, ITablePrincipal } from "@/interfaces/ITable";
import { IFormProps } from "@/interfaces/IFormProps";
import { Formik } from "formik";
import { onlyNumber, theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";

const initialValues: ITablePrincipal = {
  seatCount: 1,
};

const TableAddForm = ({ customRef }: IFormProps<ITablePrincipal>) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<ITablePrincipal>
        initialValues={initialValues}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={tableCreateSchema}
        onSubmit={async (newTable) => {
          await createObject<ITableGet, ITablePrincipal>("api/Table", newTable);
          mutate("api/Table");

          showSuccessToastMessage("La mesa se ha registrado correctamente");
        }}
      >
        {({ values, errors, handleChange, isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5} marginY={2}>
              <Grid item xs={12}>
                <TextField
                  id="seatCount"
                  type="number"
                  label="Cantidad de Asientos:"
                  error={Boolean(errors.seatCount)}
                  value={values.seatCount}
                  onChange={handleChange}
                  onKeyDown={onlyNumber}
                  InputProps={{ componentsProps: { input: { min: 1 } } }}
                  helperText={errors.seatCount}
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

export default TableAddForm;
