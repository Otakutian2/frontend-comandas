import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFormik } from "formik";

// MUI Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

// Icons
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Custom Components & Utils
import Title from "@/components/Title";
import LoaderComponent from "@/components/LoaderComponent";
import ExtraCard from "../ExtraCard"; // Asumo que esta ruta es correcta en tu proyecto
import { commandDetailsSchema } from "@/schemas/Command";
import { showSuccessToastMessage } from "@/lib/Messages";
import { getObject } from "@/services";
import { ramdonKey, roundTwoDecimal } from "@/utils";

// Interfaces
import { ICommandDetailsExtrasGet, ICommandDetailsGet } from "@/interfaces/ICommand";
import { IDishGet } from "@/interfaces";

interface CommandDetailsUpdateFormProps {
  open: boolean;
  commandDetails: ICommandDetailsGet | null;
  closeDialog: () => void;
  setCommandDetailsCollection: React.Dispatch<React.SetStateAction<ICommandDetailsGet[]>>;
  setCommandDetailsSelected: React.Dispatch<React.SetStateAction<ICommandDetailsGet | null>>;
}

const CommandDetailsUpdateForm: React.FC<CommandDetailsUpdateFormProps> = ({
  open,
  commandDetails,
  closeDialog,
  setCommandDetailsCollection,
  setCommandDetailsSelected,
}) => {
  // --- States ---
  const [availableExtras, setAvailableExtras] = useState<IDishGet[]>([]);
  const [loadingExtras, setLoadingExtras] = useState<boolean>(false);

  // --- Actions ---
  const handleClose = useCallback(() => {
    closeDialog();
    setCommandDetailsSelected(null);
  }, [closeDialog, setCommandDetailsSelected]);

  const updateLocalCollection = (
    uniqueId: string,
    observation: string | undefined,
    extras: ICommandDetailsExtrasGet[]
  ) => {
    setCommandDetailsCollection((prev) => {
      const collection = [...prev];
      const index = collection.findIndex((item) => item.uniqueId === uniqueId);
      if (index !== -1) {
        collection[index] = {
          ...collection[index],
          observation,
          extras,
        };
      }
      return collection;
    });
  };

  // --- Data Fetching ---
  const fetchDishExtras = async () => {
    setLoadingExtras(true);
    try {
      const response = await getObject<IDishGet[]>(`api/dish/extras`);
      if (response) {
        setAvailableExtras(response.filter((extra) => extra.active));
      }
    } catch (error) {
      console.error("Error fetching extras", error);
    } finally {
      setLoadingExtras(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDishExtras();
    }
  }, [open]);

  // --- Formik Setup ---
  const formik = useFormik({
    initialValues: {
      categoryId: commandDetails?.dish.category.id || "",
      dishId: commandDetails?.dish.id || "",
      observation: commandDetails?.observation || "",
      extras: commandDetails?.extras || ([] as ICommandDetailsExtrasGet[]),
    },
    enableReinitialize: true, // Esto reemplaza el useEffect manual para setValues
    validationSchema: commandDetailsSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!commandDetails?.uniqueId) return;

      updateLocalCollection(
        commandDetails.uniqueId,
        values.observation.trim() || undefined,
        values.extras
      );

      resetForm();
      handleClose();
      showSuccessToastMessage("Plato actualizado en la comanda (Recuerda guardar)");
    },
  });
 
  const handleUpdateExtra = useCallback((extraId: string, newQuantity: number) => {
    const extraDetails = availableExtras.find((e) => e.id === extraId);
    if (!extraDetails) return;

    formik.setFieldValue("extras", ((currentExtras: ICommandDetailsExtrasGet[]) => {
        const existingIndex = currentExtras.findIndex(e => e.extraDish.id === extraId);
        
        const updatedExtras = [...currentExtras];

        if (existingIndex > -1) {
            if (newQuantity === 0) {
                updatedExtras.splice(existingIndex, 1);
            } else {
                updatedExtras[existingIndex] = { 
                    ...updatedExtras[existingIndex], 
                    quantity: newQuantity 
                };
            }
        } else if (newQuantity > 0) {
            // Agregar nuevo
            updatedExtras.push({
                extraDish: extraDetails,
                extraDishId: extraDetails.id,
                quantity: newQuantity,
                commandDetailsId: commandDetails?.id,
            });
        }
        return updatedExtras;
    })(formik.values.extras));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableExtras, commandDetails?.id, formik.values.extras]); // Dependencia controlada


  const totalPrice = useMemo(() => {
    const dishPrice = commandDetails?.dish.price || 0;
    const dishQuantity = commandDetails?.dishQuantity || 1;
    
    const extrasTotal = formik.values.extras.reduce(
      (sum, extra) => sum + (extra.extraDish.price * extra.quantity),
      0
    );

    return roundTwoDecimal((dishPrice * dishQuantity) + extrasTotal);
  }, [commandDetails?.dish.price, commandDetails?.dishQuantity, formik.values.extras]);


  const isSubmitting = formik.isSubmitting;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={handleClose}>
      <DialogTitle>
        <Box sx={{ textAlign: "center", pt: 1, pb: 0 }}>
          <DinnerDiningIcon sx={{ fontSize: "4rem" }} color="warning" />
          <Title sx={{ mb: 0, fontSize: "1.5rem" }}>Modificar Plato</Title>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit} id="form-update-dish-details">
        <DialogContent sx={{ overflowY: "visible", pb: 2 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Categoría"
                sx={{color: 'black', mb: 1 }}
                value={commandDetails?.dish.category.name || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon color="primary" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
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
              />
            </Grid>

            {/* Sección de Extras */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                color="text.secondary"
              >
                Selección de Extras
              </Typography>

              <Box sx={{ maxHeight: 250, overflowY: "auto", p: 1 }}>
                {loadingExtras ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : availableExtras.length > 0 ? (
                  availableExtras.map((extra) => {
                    const selected = formik.values.extras.find(
                      (e) => e.extraDish.id === extra.id
                    );
                    const selectedQuantity = selected ? selected.quantity : 0;

                    return (
                      <ExtraCard
                        key={ramdonKey(extra.id)}
                        selectedQuantity={selectedQuantity}
                        handleUpdateExtra={handleUpdateExtra}
                        extraDish={extra}
                      />
                    );
                  })
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No hay extras disponibles para este plato.
                  </Typography>
                )}
              </Box>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Observación */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                id="observation"
                label="Observación"
                multiline
                rows={4}
                value={formik.values.observation}
                onChange={formik.handleChange}
                error={formik.touched.observation && Boolean(formik.errors.observation)}
                helperText={formik.touched.observation && formik.errors.observation}
                disabled={isSubmitting}
                inputProps={{ maxLength: 150 }}
              />
            </Grid>

            {/* Total */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: "grey.100",
                  mt: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" color="text.primary" fontWeight="medium">
                  Total Plato (x{commandDetails?.dishQuantity})
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  S/. {totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Botones de Acción */}
        <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
            <Button
              sx={{ flexGrow: 1 }}
              variant="contained"
              color="error"
              size="large"
              disabled={isSubmitting}
              onClick={handleClose}
            >
              CANCELAR
            </Button>
            <Button
              sx={{ flexGrow: 1 }}
              variant="contained"
              type="submit"
              color="primary"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoaderComponent size="1.5rem" /> : "ACTUALIZAR"}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CommandDetailsUpdateForm;