import React from "react";
import {
  styled,
  useTheme,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Stack,
  Chip
} from "@mui/material";

// Iconos
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from '@mui/icons-material/Comment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import Title from "@/components/Title";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { IReceiptInfo } from "@/interfaces/IReceipt";
import { IPaymentMethodGet } from "@/interfaces/IPaymentMethod";

// --- Estilos Personalizados ---

const TableCellHead = styled(TableCell)(({ theme }) => ({
  fontSize: "0.95rem",
  backgroundColor: theme.palette.grey[100],
  fontWeight: 700,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const TableCellBody = styled(TableCell)(({ theme }) => ({
  fontSize: "0.95rem",
  paddingTop: "12px",
  paddingBottom: "12px",
  verticalAlign: "top", // Importante para alinear si hay saltos de línea
  color: theme.palette.text.primary,
}));

// Solución al problema del scroll en observaciones
const TableCellObservation = styled(TableCell)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  paddingTop: "4px",
  paddingBottom: "12px",
  paddingLeft: "16px",
  borderBottom: "none",
  whiteSpace: "pre-wrap", // Permite que el texto baje de línea
  wordBreak: "break-word", // Evita que palabras largas rompan el layout
}));

const TableCellFooter = styled(TableCell)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.primary,
  paddingTop: "8px",
  paddingBottom: "8px",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
}));

interface ReceiptDetailsProps {
  commandDetailsCollection: ICommandDetailsGet[];
  receiptDetails: IReceiptInfo;
  paymentMethodCollection?: IPaymentMethodGet[];
  setReceiptDetails: React.Dispatch<React.SetStateAction<IReceiptInfo>>;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({
  commandDetailsCollection,
  receiptDetails,
  paymentMethodCollection,
  setReceiptDetails,
}) => {
  const theme = useTheme();

  // --- Lógica para el Descuento ---
  const renderDiscountInfo = () => {
    if (receiptDetails.discount <= 0) {
      return <Typography variant="body2" color="text.secondary">No aplica</Typography>;
    }

    if (receiptDetails.discountType === "percentage") {
      // Calculamos cuánto dinero se está descontando realmente
      const discountAmount = (receiptDetails.subTotal * receiptDetails.discount) / 100;
      
      return (
        <Stack alignItems="flex-end">
          <Typography variant="body2" color="error.main" fontWeight="bold">
             {receiptDetails.discount}% OFF
          </Typography>
          <Typography variant="caption" color="error.main">
            ( - S/. {discountAmount.toFixed(2)} )
          </Typography>
        </Stack>
      );
    }

    // Si es monto fijo
    return (
      <Typography variant="body1" color="error.main" fontWeight="bold">
        - S/. {receiptDetails.discount.toFixed(2)}
      </Typography>
    );
  };

  const handleDeletePayment = (paymentMethodId: number) => {
    setReceiptDetails((prev) => {
      const collection =
        prev.receiptDetailsCollection?.filter(
          (item) => item.paymentMethodId !== paymentMethodId
        ) || null;
      return { ...prev, receiptDetailsCollection: collection };
    });
  };

  return (
    <StyledPaper elevation={0}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3, gap: 1 }}>
        <ReceiptLongIcon color="primary" sx={{ fontSize: 30 }} />
        <Title variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 800 }}>
          DETALLE DE CUENTA
        </Title>
      </Box>

      <TableContainer sx={{ flexGrow: 1, mb: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCellHead>Descripción</TableCellHead>
              <TableCellHead align="right">Importe</TableCellHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {commandDetailsCollection.map((detail, index) => (
              <React.Fragment key={`${detail.dish.id}-${index}`}>
                {/* Fila del Producto Principal */}
                <TableRow>
                  <TableCellBody>
                    <Typography variant="body2" fontWeight="bold">
                      {detail.dishQuantity} x {detail.dish.name.toUpperCase()}
                    </Typography>
                  </TableCellBody>
                  <TableCellBody align="right" sx={{ fontWeight: 600 }}>
                    S/. {(detail.dishPrice * detail.dishQuantity).toFixed(2)}
                  </TableCellBody>
                </TableRow>

                {/* Extras */}
                {detail.extras?.map((extra, i) => (
                  <TableRow key={`extra-${index}-${i}`}>
                    <TableCellBody sx={{ pl: 4, py: 0.5, borderBottom: 'none' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        + {extra.quantity} {extra.extraDish.name}
                      </Typography>
                    </TableCellBody>
                    <TableCellBody align="right" sx={{ py: 0.5, borderBottom: 'none' }}>
                      <Typography variant="caption" color="text.secondary">
                        S/. {(extra.extraDish.price * extra.quantity).toFixed(2)}
                      </Typography>
                    </TableCellBody>
                  </TableRow>
                ))}

                {/* Observaciones (Mejorado: Sin Scroll) */}
                {detail.observation && (
                  <TableRow>
                    <TableCellObservation colSpan={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        bgcolor: theme.palette.warning.light + '20', // Fondo muy suave
                        p: 1, 
                        borderRadius: 1 
                      }}>
                        <CommentIcon sx={{ fontSize: 16, color: theme.palette.warning.main, mt: 0.3 }} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                          {detail.observation}
                        </Typography>
                      </Box>
                    </TableCellObservation>
                  </TableRow>
                )}

                {/* Separador sutil entre items */}
                <TableRow>
                   <TableCell colSpan={2} sx={{ p: 0, borderBottom: `1px dashed ${theme.palette.grey[200]}` }} />
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>

          {/* Footer Totales */}
          <TableFooter sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCellFooter align="right" sx={{ fontWeight: 500 }}>Subtotal</TableCellFooter>
              <TableCellFooter align="right" sx={{ fontWeight: 500 }}>
                S/. {receiptDetails.subTotal.toFixed(2)}
              </TableCellFooter>
            </TableRow>
            
            {/* Fila de Descuento Mejorada */}
            <TableRow>
              <TableCellFooter align="right" sx={{ color: theme.palette.error.main }}>
                Descuento
              </TableCellFooter>
              <TableCellFooter align="right">
                {renderDiscountInfo()}
              </TableCellFooter>
            </TableRow>

            {receiptDetails.additionalAmount > 0 && (
              <TableRow>
                <TableCellFooter align="right">Adicional</TableCellFooter>
                <TableCellFooter align="right">
                  S/. {receiptDetails.additionalAmount.toFixed(2)}
                </TableCellFooter>
              </TableRow>
            )}

            <TableRow>
              <TableCellFooter align="right" sx={{ pt: 2 }}>
                <Typography variant="h6" color="primary.main" fontWeight={800}>
                  TOTAL
                </Typography>
              </TableCellFooter>
              <TableCellFooter align="right" sx={{ pt: 2 }}>
                <Typography variant="h6" color="primary.main" fontWeight={800}>
                  S/. {receiptDetails.total.toFixed(2)}
                </Typography>
              </TableCellFooter>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      {/* Sección de Pagos */}
      <Box sx={{ backgroundColor: theme.palette.grey[50], p: 2, borderRadius: 2, border: `1px solid ${theme.palette.grey[200]}` }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
            <MonetizationOnIcon color="action" fontSize="small" />
            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            PAGOS REGISTRADOS
            </Typography>
        </Box>

        {(!receiptDetails.receiptDetailsCollection || 
          receiptDetails.receiptDetailsCollection.length === 0) ? (
          <Box sx={{ py: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">
              No hay pagos registrados.
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ p: 0 }}>
            {receiptDetails.receiptDetailsCollection.map((item) => {
              const method = paymentMethodCollection?.find(
                (p) => p.id === item.paymentMethodId
              );
              return (
                <ListItem
                  key={item.paymentMethodId}
                  secondaryAction={
                    <IconButton edge="end" size="small" color="error" onClick={() => handleDeletePayment(item.paymentMethodId)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ 
                    bgcolor: "white", 
                    mb: 1, 
                    borderRadius: 1, 
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItemText
                    primary={method?.name || "Desconocido"}
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                  />
                  <Typography variant="body2" fontWeight="bold" color="success.main" sx={{ mr: 2 }}>
                    S/. {item.amount.toFixed(2)}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        )}

        {/* Estado Final */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px dashed ${theme.palette.grey[300]}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" color={receiptDetails.amountDue <= 0.01 ? "success.main" : "text.secondary"}>
             {receiptDetails.amountDue <= 0.01 ? "¡CUENTA PAGADA!" : "FALTA PAGAR:"}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            {receiptDetails.amountDue <= 0.01 ? (
               <Chip 
                 icon={<CheckBoxIcon />} 
                 label="COMPLETADO" 
                 color="success" 
                 variant="outlined" 
                 sx={{ fontWeight: 'bold' }}
               />
            ) : (
                <Typography variant="h5" color="error.main" fontWeight="800">
                   S/. {receiptDetails.amountDue.toFixed(2)}
                </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default ReceiptDetails;