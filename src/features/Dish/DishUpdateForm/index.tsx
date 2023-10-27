import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ComboBox from "@/components/ComboBox";
import Swal from "sweetalert2";
import ImageDropzone from "@/components/ImageDropzone";
import dishSchema from "@/schemas/Dish";
import { IDishGet, IDishCreateOrUpdate } from "@/interfaces/IDish";
import { ICategoryGet } from "@/interfaces/ICategory";
import { IUpdateFormProps } from "@/interfaces/IFormProps";
import { useSWRConfig } from "swr";
import { useState } from "react";
import { getObject, updateObject } from "@/services/HttpRequests";
import { uploadToCloudinary, theme, onlyDecimal } from "@/utils";
import { Formik } from "formik";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";
import { AxiosError } from "axios";
import Typography from "@mui/material/Typography";

interface IDishUpdateFormProps
  extends IUpdateFormProps<IDishCreateOrUpdate, IDishGet> {
  data: ICategoryGet[];
}

const DishUpdateForm = ({
  customRef,
  values: dish,
  data,
}: IDishUpdateFormProps) => {
  const { mutate } = useSWRConfig();
  const [file, setFile] = useState<File | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <Formik<IDishCreateOrUpdate>
        initialValues={{
          image: dish.image,
          name: dish.name,
          price: dish.price,
          categoryId: dish.category.id,
        }}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={dishSchema}
        onSubmit={async (dishUpdate) => {
          try {
            await getObject(
              `api/Dish/verify-name/${dishUpdate.name}/${dish.id}`
            );

            if (file) {
              const imageUrl = await uploadToCloudinary(file);
              dishUpdate.image = imageUrl;
            }
            await updateObject<IDishGet, IDishCreateOrUpdate>(
              `api/dish/${dish.id}`,
              dishUpdate
            );
            mutate("api/dish");

            showSuccessToastMessage("El plato se ha modificado correctamente");
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
                  imageDish={values.image}
                  isSubmitting={isSubmitting}
                  onDrop={(file) => {
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
                  helperText={errors.price}
                  disabled={isSubmitting}
                  InputProps={{ componentsProps: { input: { min: 0 } } }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <ComboBox
                  id="id"
                  label="name"
                  value={dish.category}
                  values={data}
                  handleChange={(category: ICategoryGet | null) => {
                    setFieldValue("categoryId", category?.id);
                  }}
                  disabled={isSubmitting}
                  textFieldProps={{
                    label: "Categoría",
                    error: Boolean(errors.categoryId),
                    helperText: errors.categoryId,
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

export default DishUpdateForm;
