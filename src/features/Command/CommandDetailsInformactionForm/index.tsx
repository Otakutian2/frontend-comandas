import React from "react";
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
import Title from "@/components/Title";
import { ICommandDetailsGet } from "@/interfaces/ICommand";

interface CommandDetailsInformationProps {
  open: boolean;
  commandDetails: ICommandDetailsGet | null;
  closeDialog: () => void;
  setCommandDetailsSelected: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet | null>
  >;
}

const CommandDetailsInformation: React.FC<CommandDetailsInformationProps> = ({
  open,
  commandDetails,
  closeDialog,
  setCommandDetailsSelected,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>
        <Box sx={{ textAlign: "center" }}>
          <DinnerDiningIcon sx={{ fontSize: "5rem" }} color="primary" />

          <Title sx={{ mb: 0 }}>Información del Plato</Title>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflowY: "visible", pb: 2 }}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="categoryId"
                type="text"
                label="Categoría"
                value={commandDetails?.dish.category.name || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                  readOnly: true,
                }}
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
                    <InputAdornment position="start"></InputAdornment>
                  ),
                  readOnly: true,
                }}
                fullWidth={true}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="dishQuantity"
                type="text"
                label="Cantidad de Platos"
                value={commandDetails?.dishQuantity || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ProductionQuantityLimitsIcon color="primary" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                fullWidth={true}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="observation"
                type="text"
                label="Observación"
                value={commandDetails?.observation || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                  readOnly: true,
                }}
                multiline
                rows={4}
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
            color="primary"
            size="large"
            onClick={() => {
              closeDialog();
              setCommandDetailsSelected(null);
            }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CommandDetailsInformation;
