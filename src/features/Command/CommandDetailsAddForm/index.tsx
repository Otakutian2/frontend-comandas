import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ComboBox from "@/components/ComboBox";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import Title from "@/components/Title";
import { fetchAll } from "@/services/HttpRequests";
import { ICategoryGet } from "@/interfaces/ICategory";
import useSWR from "swr";
import { IDishGet } from "@/interfaces/IDish";
import ImageView from "@/components/ImageView";
import { commandDetailsSchema } from "@/schemas/Command";
import { useFormik } from "formik";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { onlyNumber, roundDecimal } from "@/utils";
import { showSuccessToastMessage } from "@/lib/Messages";
import LoaderComponent from "@/components/LoaderComponent";
import Alert from "@mui/material/Alert";

interface CommandDetailsAddFormProps {
  open: boolean;
  closeDialog: () => void;
  setCommandDetailsCollection: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet[]>
  >;
}

const CommandDetailsAddForm: React.FC<CommandDetailsAddFormProps> = ({
  open,
  closeDialog,
  setCommandDetailsCollection,
}) => {
  const { data: categoryCollection, isLoading: isLoadingCategoryCollection } =
    useSWR("api/category", () => fetchAll<ICategoryGet>("api/category"));
  const [dishCollection, setDishCollection] = React.useState<IDishGet[] | null>(
    null
  );
  const [isLoadingDishCollection, setIsLoadingDishCollection] =
    React.useState<boolean>(false);

  const fetchDishCollection = async (id: string) => {
    setIsLoadingDishCollection(true);

    try {
      const dishCollection = await fetchAll<IDishGet>(
        `api/dish/by-category/${id}`
      );
      setDishCollection(dishCollection);
    } finally {
      setIsLoadingDishCollection(false);
    }
  };

  const clearForm = () => {
    setDishCollection(null);
    resetForm();
  };

  const addToCommandDetailsCollection = (
    commandDetails: ICommandDetailsGet
  ) => {
    setCommandDetailsCollection((prev) => {
      const collection = [...prev];
      const index = collection.findIndex(
        (item) => item.dish.id === commandDetails.dish.id
      );

      if (index === -1) {
        collection.push(commandDetails);
      } else {
        collection[index] = commandDetails;
      }

      return collection;
    });
  };

  const {
    values,
    errors,
    handleChange,
    setFieldValue,
    isSubmitting,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      categoryId: "",
      dishId: "",
      dishQuantity: 1,
      observation: "",
    },
    validateOnChange: false,
    validationSchema: commandDetailsSchema,
    onSubmit: async (values) => {
      const dishSelected = dishCollection?.find(
        (item) => item.id === values.dishId
      )!;

      const commandDetails: ICommandDetailsGet = {
        dish: dishSelected,
        dishPrice: roundDecimal(dishSelected.price),
        dishQuantity: values.dishQuantity,
        observation: values.observation.trim() || undefined,
        orderPrice: roundDecimal(dishSelected.price * values.dishQuantity),
      };

      addToCommandDetailsCollection(commandDetails);
      clearForm();
      closeDialog();
      showSuccessToastMessage(
        "Plato añadido a la comanda, asegúrate de guardarla"
      );
    },
  });

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Box sx={{ textAlign: "center" }}>
          <DinnerDiningIcon sx={{ fontSize: "5rem" }} color="primary" />

          <Title sx={{ mb: 0 }}>Agregar Plato</Title>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ textAlign: "justify", mb: 2 }}>
          Ten en cuenta que al agregar el mismo plato a la comanda, este será
          reemplazado. Si deseas aumentar, disminuir o editar la observación,
          puedes utilizar la función de editar.
        </Alert>

        <form onSubmit={handleSubmit} id="form-add-dish-details">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ComboBox
                id="id"
                label={"name"}
                values={categoryCollection || []}
                loading={isLoadingCategoryCollection}
                handleChange={async (category: ICategoryGet | null) => {
                  setFieldValue("categoryId", category?.id);
                  setFieldValue("dishId", "");

                  if (category) {
                    await fetchDishCollection(category.id);
                  } else {
                    setDishCollection(null);
                  }
                }}
                disabled={isSubmitting}
                textFieldProps={{
                  label: "Categorías",
                  error: Boolean(errors.categoryId),
                  helperText: errors.categoryId,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <ComboBox
                id={"id"}
                label={"name"}
                values={dishCollection || []}
                value={dishCollection?.find(
                  (item) => item.id === values.dishId
                )}
                loading={isLoadingDishCollection}
                handleChange={(dish: IDishGet | null) => {
                  setFieldValue("dishId", dish?.id);
                }}
                disabled={isSubmitting}
                textFieldProps={{
                  label: "Platos",
                  error: Boolean(errors.dishId),
                  helperText: errors.dishId,
                }}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > div": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <ImageView image={option.image} />
                    {option.name}
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="dishQuantity"
                type="number"
                label="Cantidad de Platos"
                error={Boolean(errors.dishQuantity)}
                value={values.dishQuantity}
                onChange={handleChange}
                onKeyDown={onlyNumber}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ProductionQuantityLimitsIcon color="primary" />
                    </InputAdornment>
                  ),
                  componentsProps: { input: { min: 1, max: 15 } },
                }}
                helperText={errors.dishQuantity}
                disabled={isSubmitting}
                fullWidth={true}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="observation"
                type="text"
                label="Observación"
                error={Boolean(errors.observation)}
                value={values.observation}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                  componentsProps: { input: { maxLength: 150 } },
                }}
                multiline
                rows={4}
                helperText={errors.observation}
                disabled={isSubmitting}
                fullWidth={true}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", width: "100%", gap: 2, flexWrap: "wrap" }}>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            type="submit"
            form="form-add-dish-details"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoaderComponent size="1.5rem" /> : "Agregar"}
          </Button>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            size="large"
            onClick={() => {
              clearForm();
              closeDialog();
            }}
          >
            Cancelar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CommandDetailsAddForm;
