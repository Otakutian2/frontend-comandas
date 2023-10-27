import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import categorySchema from "@/schemas/Category";
import Swal from "sweetalert2";
import { useSWRConfig } from "swr";
import { createObject } from "@/services/HttpRequests";
import { ICategoryGet, ICategoryPrincipal } from "@/interfaces/ICategory";
import { IFormProps } from "@/interfaces/IFormProps";
import { Formik } from "formik";
import { theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";
import { AxiosError } from "axios";

const initialValues: ICategoryPrincipal = {
  name: "",
};

const CategoryAddForm = ({ customRef }: IFormProps<ICategoryPrincipal>) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<ICategoryPrincipal>
        initialValues={initialValues}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={categorySchema}
        onSubmit={async (newCategory) => {
          try {
            await createObject<ICategoryGet, ICategoryPrincipal>(
              "api/category",
              newCategory
            );
            mutate("api/category");

            showSuccessToastMessage(
              "La categoría se ha registrado correctamente"
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
                  label="Categoría"
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

export default CategoryAddForm;
