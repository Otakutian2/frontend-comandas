import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import TypeTableState from "@/enum/TypeTableState";
import { ITableGet, ITableUpdate } from "@/interfaces/ITable";
import { IUpdateFormProps } from "@/interfaces/IFormProps";
import { useSWRConfig } from "swr";
import { updateObject } from "@/services/HttpRequests";
import { tableUpdateSchema } from "@/schemas";
import { Formik } from "formik";
import { onlyNumber, theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";

const TableUpdateForm = ({
  customRef,
  values,
}: IUpdateFormProps<ITableUpdate, ITableGet>) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<ITableUpdate>
        initialValues={{
          seatCount: values.seatCount,
          state: Object.values(TypeTableState).find((v) => v === values.state)!,
        }}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={tableUpdateSchema}
        onSubmit={async (tableUpdate) => {
          await updateObject<ITableGet, ITableUpdate>(
            `api/Table/${values.id}`,
            tableUpdate
          );
          mutate("api/Table");

          showSuccessToastMessage("La mesa se ha modificado correctamente");
        }}
      >
        {({ values, errors, handleChange, isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5} marginY={2}>
              <Grid item xs={12}>
                <TextField
                  id="seatCount"
                  type="number"
                  label="Cantidad de Asientos"
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

export default TableUpdateForm;
