import Typography from "@mui/material/Typography";
import NoMealsIcon from "@mui/icons-material/NoMeals";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { ITableWithCommand } from "@/interfaces/ITable";
import UserRoles from "@/interfaces/UserRoles";
import useSWR from "swr";
import { fetchAll } from "@/services/HttpRequests";
import { useUserStore } from "@/store/user";
import TableCard from "@/components/TableCard";
import Title from "@/components/Title";
import ContentBox from "@/components/ContentBox";
import LoaderComponent from "@/components/LoaderComponent";
import { useRouter } from "next/router";
import { APP_ROUTES } from "@/routes";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import ComboBox from "@/components/ComboBox";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DeleteIcon from "@mui/icons-material/Delete";

interface IFilters {
  optionId: number;
  tableId: string;
  commandId: string;
}

const options = [
  {
    id: 1,
    label: "Todos",
  },
  {
    id: 2,
    label: "Pedidos para llevar",
  },
  {
    id: 3,
    label: "Pedidos de mesas",
  },
];

const CommandSection = () => {
  const { data, isLoading } = useSWR("api/table/commands", () =>
    fetchAll<ITableWithCommand>("api/table/commands")
  );
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const role = user?.role.name as UserRoles;
  const canManageCommand = role === "Administrador" || role === "Mesero";
  const entity = canManageCommand ? "mesas y comandas" : "comandas";
  const [collection, setCollection] = useState<
    ITableWithCommand[] | undefined
  >();
  const [filters, setFilters] = useState<IFilters>({
    optionId: options[0].id,
    tableId: "",
    commandId: "",
  });
  const theme = useTheme();

  useEffect(() => {
    if (data == null) {
      return;
    }

    setCollection(data);
  }, [data]);

  useEffect(() => {
    filterCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filterCollection = () => {
    const filteredData = data?.filter((item) => {
      const isTableMatch =
        item.table && item.table.id.toString().includes(filters.tableId);
      const isCommandMatch =
        item.command && item.command.id.toString().includes(filters.commandId);

      if (filters.commandId && filters.tableId) {
        return isTableMatch || isCommandMatch;
      }

      if (filters.commandId) {
        return isCommandMatch;
      }

      if (filters.tableId && filters.optionId !== 2) {
        return isTableMatch;
      }

      return true;
    });

    setCollection(filterByComboBox(filteredData));
  };

  const filterByComboBox = (filteredData?: ITableWithCommand[]) => {
    if (filters.optionId == 1) {
      return filteredData;
    }

    if (filters.optionId == 2) {
      return filteredData?.filter((item) => !item.table);
    }

    return filteredData?.filter((item) => item.table);
  };

  const resetFilters = () => {
    setFilters({ optionId: options[0].id, tableId: "", commandId: "" });
  };

  return (
    <div>
      <ContentBox sxProps={{ p: 2 }}>
        <Title variant="h2" sx={{ textTransform: "capitalize" }}>
          {entity}
        </Title>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            id="commandId"
            type="text"
            label={"Número de Comanda"}
            value={filters.commandId}
            size="small"
            onChange={(e) => {
              setFilters({ ...filters, commandId: e.target.value.trim() });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FactCheckIcon color="primary" />
                </InputAdornment>
              ),
              componentsProps: { input: { maxLength: 4 } },
            }}
          />
          <TextField
            id="taableId"
            type="text"
            label={"Número de Mesa"}
            value={filters.tableId}
            size="small"
            onChange={(e) => {
              setFilters({ ...filters, tableId: e.target.value.trim() });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TableRestaurantIcon color="primary" />
                </InputAdornment>
              ),
              componentsProps: { input: { maxLength: 4 } },
            }}
          />

          <Tooltip title="Limpiar filtros" placement="right" arrow>
            <IconButton color="error" onClick={resetFilters}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mb: 2, maxWidth: "300px" }}>
          <ComboBox
            id={"id"}
            values={options}
            value={options.find((item) => item.id === filters.optionId)}
            label={"label"}
            textFieldProps={{
              label: "Filtrar por",
            }}
            disableClearable={true}
            size="small"
            handleChange={(e) => {
              setFilters({ ...filters, optionId: e!.id });
            }}
          />
        </Box>

        {canManageCommand && (
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            color="primary"
            onClick={() => {
              router.push(`${APP_ROUTES.command}/new`);
            }}
          >
            Pedido para llevar
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems:
              !collection || collection.length === 0 || isLoading
                ? "center"
                : "flex-start",
            minHeight: "600px",
          }}
        >
          {isLoading ? (
            <LoaderComponent />
          ) : (
            <Grid
              container
              columnSpacing={6}
              rowSpacing={4}
              sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}
            >
              {collection && collection.length > 0 ? (
                collection?.map((tableWithCommand, index) => (
                  <Grid
                    key={index}
                    item
                    xs
                    sx={{
                      minWidth: `calc(${theme.spacing(6)} + 260px) !important`,
                      maxWidth: `calc(${theme.spacing(6)} + 280px) !important`,
                    }}
                  >
                    <TableCard tableWithCommand={tableWithCommand} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center", color: "rgb(99, 115, 129)" }}>
                    <NoMealsIcon sx={{ fontSize: "50px" }} />
                    <Typography>{`No hay ${entity}`}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </ContentBox>
    </div>
  );
};

export default CommandSection;
