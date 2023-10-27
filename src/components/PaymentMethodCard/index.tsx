import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageView from "../ImageView";

interface PaymentMethodCardProps {
  imageUrl?: string;
  name: string;
  amount: number;
  deletePaymentMethod: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  imageUrl,
  name,
  amount,
  deletePaymentMethod,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <ImageView image={imageUrl} />
        <Typography>{name}</Typography>
      </Box>

      <Box>
        <Typography>S/. {amount.toFixed(2)}</Typography>
      </Box>

      <Box>
        <Tooltip title="Eliminar Pago" placement="bottom" arrow>
          <IconButton color="error" size="large" onClick={deletePaymentMethod}>
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PaymentMethodCard;
