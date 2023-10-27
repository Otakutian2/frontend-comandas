import React, { useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Title from "@/components/Title";
import { commandDetailsSchema } from "@/schemas/Command";
import { useFormik } from "formik";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { onlyNumber, roundDecimal } from "@/utils";
import { showSuccessToastMessage } from "@/lib/Messages";
import LoaderComponent from "@/components/LoaderComponent";

interface CommandDetailsUpdateFormProps {
  open: boolean;
  commandDetails: ICommandDetailsGet | null;
  closeDialog: () => void;
  setCommandDetailsCollection: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet[]>
  >;
  setCommandDetailsSelected: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet | null>
  >;
}

const CommandDetailsUpdateForm: React.FC<CommandDetailsUpdateFormProps> = ({
  open,
  commandDetails,
  closeDialog,
  setCommandDetailsCollection,
  setCommandDetailsSelected,
}) => {
  const clearForm = () => {
    resetForm();
    setCommandDetailsSelected(null);
  };

  const updateCommandDetails = ({
    dishQuantity,
    observation,
    dishId,
  }: {
    dishQuantity: number;
    observation?: string;
    dishId: string;
  }) => {
    setCommandDetailsCollection((prev) => {
      const collection = [...prev];

      const index = collection.findIndex((item) => item.dish.id === dishId);

      collection[index].dishQuantity = dishQuantity;
      collection[index].observation = observation;
      collection[index].orderPrice = roundDecimal(
        dishQuantity * collection[index].dish.price
      );

      return collection;
    });
  };

  const {
    values,
    errors,
    handleChange,
    isSubmitting,
    handleSubmit,
    resetForm,
    setValues,
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
      updateCommandDetails({
        dishQuantity: values.dishQuantity,
        observation: values.observation.trim() || undefined,
        dishId: values.dishId,
      });

      clearForm();
      closeDialog();
      showSuccessToastMessage(
        "Plato actualizado en la comanda, asegúrate de guardarla"
      );
    },
  });

  useEffect(() => {
    if (commandDetails) {
      setValues({
        categoryId: commandDetails.dish.category.id,
        dishId: commandDetails.dish.id,
        dishQuantity: commandDetails.dishQuantity,
        observation: commandDetails.observation || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandDetails]);

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Box sx={{ textAlign: "center" }}>
          <DinnerDiningIcon sx={{ fontSize: "5rem" }} color="warning" />

          <Title sx={{ mb: 0 }}>Modificar Plato</Title>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflowY: "visible", pb: 2 }}>
        <form onSubmit={handleSubmit} id="form-update-dish-details">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="categoryId"
                type="text"
                label="Categoría"
                value={commandDetails?.dish.category.name || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon color="primary" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                disabled={isSubmitting}
                fullWidth={true}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="dishId"
                type="text"
                label="Plato"
                value={commandDetails?.dish.name || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FastfoodIcon color="primary" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                disabled={isSubmitting}
                fullWidth={true}
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
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Box sx={{ display: "flex", width: "100%", gap: 2, flexWrap: "wrap" }}>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            type="submit"
            color="warning"
            form="form-update-dish-details"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoaderComponent size="1.5rem" /> : "Actualizar"}
          </Button>
          <Button
            sx={{ flexGrow: 1 }}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            size="large"
            onClick={() => {
              closeDialog();
              clearForm();
            }}
          >
            Cancelar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CommandDetailsUpdateForm;
