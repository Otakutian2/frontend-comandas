import ComboBox from "@/components/ComboBox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ImageDropzone from "@/components/ImageDropzone";
import dishSchema from "@/schemas/Dish";
import Swal from "sweetalert2";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import { useSWRConfig } from "swr";
import { createObject, getObject } from "@/services/HttpRequests";
import { ICategoryGet } from "@/interfaces/ICategory";
import { IDishCreateOrUpdate, IDishGet } from "@/interfaces/IDish";
import { IFormProps } from "@/interfaces/IFormProps";
import { onlyDecimal, uploadToCloudinary } from "@/utils";
import { Formik } from "formik";
import { useState } from "react";
import { showSuccessToastMessage } from "@/lib/Messages";
import { AxiosError } from "axios";

const initialValues: IDishCreateOrUpdate = {
  name: "",
  price: 0.0,
  image: "",
};

interface IDishAddFormProps extends IFormProps<IDishCreateOrUpdate> {
  data: ICategoryGet[];
}

const DishAddForm = ({ customRef, data }: IDishAddFormProps) => {
  const theme = useTheme();
  const { mutate } = useSWRConfig();
  const [file, setFile] = useState<File | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <Formik<IDishCreateOrUpdate>
        initialValues={initialValues}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={dishSchema}
        onSubmit={async (newDish) => {
          try {
            await getObject(`api/Dish/verify-name/${newDish.name}`);

            if (file) {
              const urlImage = await uploadToCloudinary(file);
              newDish.image = urlImage;
            }

            await createObject<IDishGet, IDishCreateOrUpdate>(
              "api/dish",
              newDish
            );
            mutate("api/dish");

            showSuccessToastMessage("El plato se ha registrado correctamente");
          } catch (err) {
            const error = err as AxiosError;
            Swal.showValidationMessage(error.response?.data as string);
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          setFieldValue,
          isSubmitting,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5} marginY={2}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <ImageDropzone
                  isSubmitting={isSubmitting}
                  onDrop={(file) => {
                    if (file.size > 1048576) {
                      return;
                    }
                    setFile(file);
                    setFieldValue("image", file.name);
                  }}
                />
                {errors.image && (
                  <Typography
                    sx={{
                      color: `${theme.palette.error.main}`,
                    }}
                    variant="caption"
                  >
                    {errors.image}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="name"
                  type="text"
                  label="Plato"
                  error={Boolean(errors.name)}
                  value={values.name}
                  onChange={handleChange}
                  helperText={errors.name}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="price"
                  type="number"
                  label="Precio"
                  error={Boolean(errors.price)}
                  value={values.price}
                  onChange={handleChange}
                  onKeyDown={onlyDecimal}
                  InputProps={{
                    componentsProps: { input: { min: 0, step: "any" } },
                  }}
                  helperText={errors.price}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <ComboBox
                  id="id"
                  label="name"
                  values={data}
                  handleChange={(category: ICategoryGet | null) => {
                    setFieldValue("categoryId", category?.id);
                  }}
                  disabled={isSubmitting}
                  textFieldProps={{
                    label: "Categoría",
                    error: Boolean(errors.categoryId),
                    helperText: errors.categoryId,
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

export default DishAddForm;
