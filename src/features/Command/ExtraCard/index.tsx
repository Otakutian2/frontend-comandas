import React, { useMemo } from "react";
import Image from "next/image";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { roundTwoDecimal } from "@/utils";
import { IDishGet } from "@/interfaces";

interface ExtraCardProps {
  extraDish: IDishGet;
  selectedQuantity: number;
  handleUpdateExtra: (extraId: string, quantity: number) => void;
}

const ExtraCard: React.FC<ExtraCardProps> = ({
  extraDish,
  selectedQuantity,
  handleUpdateExtra,
}) => {
  // Optimizamos el cálculo
  const totalExtraPrice = useMemo(
    () => roundTwoDecimal(extraDish.price * selectedQuantity),
    [extraDish.price, selectedQuantity]
  );

  const isSelected = selectedQuantity > 0;

  const handleIncrement = () => handleUpdateExtra(extraDish.id, selectedQuantity + 1);
  
  const handleDecrement = () => {
    if (selectedQuantity > 0) {
      handleUpdateExtra(extraDish.id, selectedQuantity - 1);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1.5,
        mb: 1.5,
        borderRadius: 2,
        // Usamos box-shadow o border suave en lugar de borde azul fuerte para cleaner look
        border: "1px solid",
        borderColor: isSelected ? "primary.main" : "grey.300",
        bgcolor: isSelected ? "primary.50" : "background.paper",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* SECCIÓN IZQUIERDA: IMAGEN + INFO (Ocupa todo el espacio disponible) */}
      <Box sx={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden", mr: 1 }}>
        <Box
          sx={{
            position: "relative",
            width: 48, // Un poco más grande para mejor visibilidad
            height: 48,
            flexShrink: 0, // CRUCIAL: La imagen no se debe encoger
            mr: 1.5,
          }}
        >
          <Image
            src={extraDish.image || "https://www.redbubble.com/i/sticker/IMAGE-NOT-FOUND-by-ZexyAmbassador/142878675.EJUG5"}
            alt={extraDish.name || "Imagen no disponible"}
            fill
            sizes="48px"
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}> {/* minWidth 0 permite que el texto trunque correctamente en flex */}
          <Typography
            variant="body2"
            fontWeight="bold"
            noWrap // Corta el texto con "..." si es muy largo
            color={isSelected ? "text.primary" : "text.secondary"}
            title={extraDish.name} // Tooltip nativo al hacer hover
          >
            {extraDish.name}
          </Typography>
          <Typography
            variant="caption"
            color={isSelected ? "text.secondary" : "text.disabled"}
            sx={{ whiteSpace: "nowrap" }}
          >
            S/. {extraDish.price.toFixed(2)} c/u
          </Typography>
        </Box>
      </Box>

      {/* SECCIÓN DERECHA: CONTROLES + TOTAL (No se encogen) */}
      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        
        {/* Controles de Cantidad */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
            mr: 2, // Margen seguro contra el precio total
          }}
        >
          <IconButton
            onClick={handleDecrement}
            disabled={!isSelected}
            color={isSelected ? "error" : "default"}
            size="small"
            sx={{ p: 0.5 }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{
              width: 24, // Ancho fijo para el número evita saltos ("jitter")
              textAlign: "center",
              userSelect: "none",
            }}
          >
            {selectedQuantity}
          </Typography>

          <IconButton
            onClick={handleIncrement}
            color="primary"
            size="small"
            sx={{ p: 0.5 }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Precio Total */}
        <Box sx={{ textAlign: "right", minWidth: 75 }}> {/* minWidth mayor para alinear columna */}
          <Typography
            variant="caption"
            display="block"
            color={isSelected ? "text.secondary" : "text.disabled"}
            sx={{ lineHeight: 1, mb: 0.5 }}
          >
            Total
          </Typography>
          <Typography
            variant="body2"
            fontWeight="bold"
            color={isSelected ? "primary.main" : "text.disabled"}
            sx={{ whiteSpace: "nowrap" }} // Evita que "S/." quede arriba y el numero abajo
          >
            S/. {totalExtraPrice.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default React.memo(ExtraCard);