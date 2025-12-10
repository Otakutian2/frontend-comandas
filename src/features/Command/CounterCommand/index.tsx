import { ICommandDetailsGet } from "@/interfaces/ICommand";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import React from "react";
import { cutString, roundTwoDecimal } from "@/utils";

interface CounterCommandProps {
  commandDetail: ICommandDetailsGet;
  setCurrentCommandDetail: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet[]>
  >;
  setCommandDetailsSelected: React.Dispatch<
    React.SetStateAction<ICommandDetailsGet | null>
  >;
  openUpdateFormDialog: () => void;
}
function CounterCommand({
  commandDetail,
  setCurrentCommandDetail,
  setCommandDetailsSelected,
  openUpdateFormDialog,
}: CounterCommandProps) {
  const [count, setCount] = React.useState(commandDetail.dishQuantity);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Detén la propagación del evento en el cierre
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation(); // Detén la propagación del evento en el cierre
    setAnchorEl(null);
  };

  const increment = (id: string) => {
    setCurrentCommandDetail((prev) => {
      return prev.map((item) => {
        if (item.uniqueId === id) {
          return {
            ...item,
            dishQuantity: item.dishQuantity + 1,
            orderPrice: roundTwoDecimal(
              item.dish.price * (item.dishQuantity + 1)
            ),
          };
        }
        return item;
      });
    });
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = (id: string) => {
    if (count === 1) return;

    setCurrentCommandDetail((prev) => {
      return prev.map((item) => {
        if (item.uniqueId === id) {
          return {
            ...item,
            dishQuantity: item.dishQuantity - 1,
            orderPrice: roundTwoDecimal(
              item.dish.price * (item.dishQuantity - 1)
            ),
          };
        }
        return item;
      });
    });
    setCount((prevCount) => prevCount - 1);
  };

  const remove = (id: string) => {
    setCurrentCommandDetail((prev) => {
      return prev.filter((item) => item.uniqueId !== id);
    });
    setAnchorEl(null);
  };

  const totalExtras = commandDetail.extras.reduce(
    (acc, extra) => acc + extra.extraDish.price * extra.quantity,
    0
  );
  const totalPrice = roundTwoDecimal(
    (commandDetail.dish.price * count )+ totalExtras
  );

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        padding: 1.5,
        marginBottom: 1,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        minHeight: 95,
        boxShadow: 1,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1, 
          minWidth: 0,
        }}
      >
        <Image
          src={commandDetail.dish.image || "https://www.redbubble.com/i/sticker/IMAGE-NOT-FOUND-by-ZexyAmbassador/142878675.EJUG5"}
          alt={commandDetail.dish.name || "Imagen no disponible"}
          width={50}
          height={50}
          style={{ borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 1.5,
            minWidth: 0,
          }}
        >
          <Typography variant="body2" fontWeight="bold" noWrap>
            {commandDetail.dish.name}{" "}
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="caption" color="text.secondary">
              Unit: S/. {commandDetail.dish.price.toFixed(2)}
            </Typography>
            {commandDetail.extras.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Extras: S/. {totalExtras.toFixed(2)} c/u
              </Typography>
            )}
          </Box>

          {commandDetail.extras.length > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              Costo Unitario: S/. {commandDetail.dish.price.toFixed(2)}
            </Typography>
          )}

          {/* Precio Total - Visible en todas las vistas */}
          <Typography
            variant="body1"
            color="primary.main"
            fontWeight="bold"
            sx={{ mt: { xs: 0, sm: 0.5 } }}
          >
            Total: S/. {totalPrice.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Columna Central: Contador (Ancho fijo) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          // Usa un ancho fijo para el contador en todas las vistas para evitar que se comprima
          width: "auto",
          minWidth: 100,
          mx: 1,
        }}
      >
        <IconButton
          onClick={() => decrement(commandDetail.uniqueId!)}
          color="primary"
          size="small"
          disabled={count === 1} // Deshabilitar si la cantidad es 1
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        {/* Caja del Contador (Para que tenga el estilo del input) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "20px",
            height: 32, // Altura estándar para botones pequeños
            px: 1,
            border: 1,
            borderColor: "grey.400",
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            {count}
          </Typography>
        </Box>
        <IconButton
          onClick={() => increment(commandDetail.uniqueId!)}
          color="primary"
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Columna Derecha: Botones de Acción (Ancho fijo, no crece) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0, // No permite que se encoja o crezca
          minWidth: { xs: "35px", md: "180px" }, // Ancho suficiente para los botones/menú
          justifyContent: "flex-end",
        }}
      >
        {/* Botón de Menú (Visible en Móviles) */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={(ev) => handleClick(ev)}
          size="medium"
          aria-label="opciones"
        >
          <MoreVertIcon />
        </IconButton>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setCommandDetailsSelected(commandDetail);
              openUpdateFormDialog();
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => remove(commandDetail.uniqueId!)}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} />
            Eliminar
          </Button>
        </Stack>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={(ev) => {
              ev.stopPropagation();
              setCommandDetailsSelected(commandDetail);
              openUpdateFormDialog();
              handleClose(ev);
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
            Editar
          </MenuItem>
          <MenuItem onClick={() => remove(commandDetail.uniqueId!)}>
            <DeleteIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
            Eliminar
          </MenuItem>
        </Menu>
      </Box>
    </Box>
    // <Box

    //   component="div"
    //   sx={{
    //     display: "flex",
    //     flexDirection: "row",
    //     width: "100%",
    //     overflow: "hidden",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    //     padding: 2,
    //     marginBottom: 1,
    //     borderRadius: 1.5,
    //     border : 1,
    //     height: 70,
    //   }}
    // >
    //   <Box
    //     component="div"
    //     sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         alignItems: "center", // Alinea verticalmente
    //         width: "40%", // Ajusta este valor según el layout deseado
    //         overflow: "hidden", // Oculta el contenido que sobresale
    //     }}
    //   >
    //   <Image
    //     src={commandDetail.dish.image}
    //     alt={commandDetail.dish.name}
    //     width={50}
    //     height={50} />

    //     <p
    //         style={{
    //             marginLeft: 10,
    //             fontSize: 16,
    //         }}
    //     >
    //         {cutString(commandDetail.dish.name, 16)}
    //     </p>
    //   </Box>

    //   <Box
    //     component="div"
    //     sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         justifyContent: "center", // Centra los botones en horizontal
    //         alignItems: "center", // Centra los botones en vertical
    //         width: "30%", // Ajusta este valor según el layout deseado
    //     }}
    //   >
    //     <IconButton
    //       onClick={() => decrement(commandDetail.uniqueId!)}
    //       color="primary"
    //       aria-label="minus"
    //       size="small"
    //     >
    //       <RemoveIcon />
    //     </IconButton>

    //     {/* <Button
    //         onClick={() => decrement(commandDetail.dish.id)}

    //       variant="contained"
    //       color="primary"
    //       sx={{
    //         borderRadius: 1.5,
    //         padding: 1,
    //         minWidth: 50,
    //         minHeight: 50,
    //         backgroundColor: "primary.main",
    //         color: "background.default",
    //       }}
    //     >

    //     </Button> */}
    //     <Box
    //       component="div"
    //       sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         padding: 1,
    //         borderRadius: 1.5,
    //         border: 1,
    //         borderColor: "primary.main",
    //         borderStyle: "solid",
    //         minWidth: 50,
    //         minHeight: 50,
    //       }}
    //     >
    //       {count}
    //     </Box>
    //     <IconButton
    //       onClick={() => increment(commandDetail.uniqueId!)}
    //       color="primary"
    //       aria-label="plus"
    //       size="small"
    //     >
    //       <AddIcon />
    //     </IconButton>
    //   </Box>

    //   <Box sx={{ textAlign: 'right', marginRight: 0.5 ,display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '20%'}}>
    //         <Typography variant="caption" display="block" color="text.secondary" sx={{ lineHeight: 1 }}>
    //             Total
    //         </Typography>
    //         <Typography variant="body2" fontWeight="bold" color="primary">
    //             S/. {commandDetail.orderPrice.toFixed(2)}
    //         </Typography>
    //     </Box>

    //   <Box
    //   sx={{
    //     display: "flex",
    //     justifyContent: "flex-end", // Alinea el menú a la derecha
    //     width: "20%", // Ajusta el ancho
    //   }}
    //   >
    //     <Button
    //       onClick={
    //         ev => handleClick(ev)
    //       }
    //       color="info"
    //       aria-label="plus"
    //       size="small"
    //       id="basic-button"
    //     >
    //       <MoreVertIcon />
    //       <Menu
    //         id="basic-menu"
    //         anchorEl={anchorEl}
    //         open={open}
    //         onClose={handleClose}

    //       >
    //         <MenuItem
    //           onClick={(ev) => {
    //             ev.stopPropagation();
    //             setCommandDetailsSelected(commandDetail);
    //             openUpdateFormDialog();
    //             handleClose(ev);
    //           }}
    //         >
    //           <EditIcon
    //             color="primary"
    //           />
    //           Editar
    //         </MenuItem>
    //         <MenuItem onClick={() => remove(commandDetail.uniqueId!)}>
    //           <DeleteIcon
    //             color="error"
    //           />
    //           Eliminar
    //         </MenuItem>
    //       </Menu>
    //     </Button>
    //   </Box>
    // </Box>
  );
}

export default CounterCommand;
