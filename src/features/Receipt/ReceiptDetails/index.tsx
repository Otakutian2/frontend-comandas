import Title from "@/components/Title";
import { styled, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import React from "react";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { IReceiptInfo } from "@/interfaces/IReceipt";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Typography from "@mui/material/Typography";

const TableCellHead = styled(TableCell)(({ theme }) => ({
  fontSize: "1.25rem",
  backgroundColor: "#fff",
  fontWeight: "bold",
  color: theme.palette.grey[600],
}));

const TableCellBody = styled(TableCell)(() => ({
  fontSize: "1rem",
}));

const TableCellFooter = styled(TableCell)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.grey[600],
  fontWeight: "bold",
}));

const TableStickyFooter = styled(TableFooter)(() => ({
  position: "sticky",
  bottom: 0,
  backgroundColor: "#fff",
}));

interface ReceiptDetailsProps {
  commandDetailsCollection: ICommandDetailsGet[];
  receiptDetails: IReceiptInfo;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({
  commandDetailsCollection,
  receiptDetails,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Title
        sx={{
          fontSize: "1.5rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          color: theme.palette.grey[700],
        }}
        variant="h2"
      >
        DETALLE DEL COMPROBANTE
      </Title>

      <Box>
        <TableContainer
          sx={{
            maxHeight: 600,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCellHead>Productos</TableCellHead>
                <TableCellHead align="right">Total</TableCellHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {commandDetailsCollection.map((commandDetails) => (
                <TableRow tabIndex={-1} key={commandDetails.dish.id}>
                  <TableCellBody>
                    x{commandDetails.dishQuantity}{" "}
                    {commandDetails.dish.name.toLocaleUpperCase()}
                  </TableCellBody>
                  <TableCellBody align="right">
                    S/. {commandDetails.orderPrice.toFixed(2)}
                  </TableCellBody>
                </TableRow>
              ))}
            </TableBody>
            <TableStickyFooter>
              <TableRow>
                <TableCellFooter
                  sx={{ borderTop: "2px solid  #757575" }}
                  align="right"
                >
                  Subtotal
                </TableCellFooter>
                <TableCellFooter
                  sx={{ borderTop: "2px solid  #757575" }}
                  align="right"
                >
                  S/. {receiptDetails.subTotal.toFixed(2)}
                </TableCellFooter>
              </TableRow>
              <TableRow>
                <TableCellFooter align="right">IGV</TableCellFooter>
                <TableCellFooter align="right">
                  S/. {receiptDetails.igv.toFixed(2)}
                </TableCellFooter>
              </TableRow>
              <TableRow>
                <TableCellFooter align="right">Descuento</TableCellFooter>
                <TableCellFooter align="right">
                  S/. {receiptDetails.discount.toFixed(2)}
                </TableCellFooter>
              </TableRow>
              <TableRow>
                <TableCellFooter align="right">Adicional</TableCellFooter>
                <TableCellFooter align="right">
                  S/. {receiptDetails.additionalAmount.toFixed(2)}
                </TableCellFooter>
              </TableRow>
              <TableRow>
                <TableCellFooter align="right">Total</TableCellFooter>
                <TableCellFooter align="right">
                  S/. {receiptDetails.total.toFixed(2)}
                </TableCellFooter>
              </TableRow>
            </TableStickyFooter>
          </Table>
        </TableContainer>

        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              textAlign: "right",
              fontSize: "1.25rem",
              color: theme.palette.grey[600],
              fontWeight: "bold",
            }}
          >
            {receiptDetails.amountDue === 0
              ? "Completado"
              : `Falta pagar: S/. ${receiptDetails.amountDue.toFixed(2)}`}
          </Typography>
          {receiptDetails.amountDue === 0 && (
            <CheckBoxIcon fontSize="large" color="success" />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReceiptDetails;
