import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import SellIcon from "@mui/icons-material/Sell";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import AccessTimeFilledOutlinedIcon from "@mui/icons-material/AccessTimeFilledOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import PersonIcon from "@mui/icons-material/Person";
import dayjs from "dayjs";
import { ITableWithCommand, TableState } from "@/interfaces/ITable";
import { styled } from "@mui/material";
import { useRouter } from "next/router";
import { APP_ROUTES } from "@/routes";
import FactCheckIcon from "@mui/icons-material/FactCheck";

interface TableCardProps {
  tableWithCommand: ITableWithCommand;
}

const CardContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "type",
})<{ type: TableState }>(({ type, theme }) => ({
  borderRadius: "0.5rem",
  padding: "1.5rem",
  margin: "auto",
  minHeight: "390px",
  display: "flex",
  flexDirection: "column",
  fontWeight: "bold",
  fontSize: "20px",
  color: "#fff",
  cursor: "pointer",
  backgroundColor: type == "Libre" ? "#4CAF50" : "#F44336",
  "&:hover": {
    backgroundColor: type == "Libre" ? "#388E3C" : "#D32F2F",
    transition: "0.5s ease",
  },
  "&:active": {
    backgroundColor: type == "Libre" ? "#1B5E20" : "#B71C1C",
  },
}));

const TableCard: React.FC<TableCardProps> = ({
  tableWithCommand: { table, command },
}) => {
  const router = useRouter();

  const items = [
    {
      Icon: TableRestaurantIcon,
      value: table?.id,
    },
    {
      Icon: ChairAltIcon,
      value: table?.seatCount,
    },
    {
      Icon: CalendarMonthIcon,
      value: command
        ? dayjs(command.createdAt).format("DD/MM/YYYY hh:mm")
        : undefined,
    },
    {
      Icon: PriceChangeIcon,
      value: command ? `S/. ${command.totalOrderPrice.toFixed(2)}` : undefined,
    },
    {
      Icon: RamenDiningIcon,
      value: command?.quantityOfDish,
    },
    {
      Icon: PersonIcon,
      value: command
        ? command.employee.firstName + " " + command.employee.lastName
        : undefined,
    },
    {
      Icon: SellIcon,
      value: command?.commandState.name,
    },
    {
      Icon: FactCheckIcon,
      value: command ? `Comanda - ${command?.id}` : undefined,
    },
  ];

  return (
    <CardContent
      type={table?.state as TableState}
      onClick={() => {
        router.push(
          `${APP_ROUTES.command}/${
            command ? command.id : `new?tableId=${table?.id}`
          }`
        );
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {items.map(
          ({ Icon, value }, index) =>
            value && (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Icon fontSize="medium" />
                <Typography>{value}</Typography>
              </Box>
            )
        )}
      </Box>

      <Box
        sx={{
          gap: 1,
          mt: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {table?.state == "Ocupado" || !table ? (
          <AccessTimeFilledOutlinedIcon fontSize="medium" />
        ) : (
          <CheckCircleIcon fontSize="medium" />
        )}

        <Typography>{table?.state || "Para llevar"}</Typography>
      </Box>
    </CardContent>
  );
};

export default TableCard;
