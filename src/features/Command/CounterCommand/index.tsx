import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
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
        if (item.dish.id === id) {
          return {
            ...item,
            dishQuantity: item.dishQuantity + 1,
            orderPrice: roundTwoDecimal(item.dish.price * (item.dishQuantity + 1)),
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
        if (item.dish.id === id) {
          return {
            ...item,
            dishQuantity: item.dishQuantity - 1,
            orderPrice: roundTwoDecimal(item.dish.price * (item.dishQuantity - 1)),
          };
        }
        return item;
      });
    });
    setCount((prevCount) => prevCount - 1);

  };

  const remove = (id: string) => {
    setCurrentCommandDetail((prev) => {
      return prev.filter((item) => item.dish.id !== id);
    });
  };

  return (
    <Box


      component="div"
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        marginBottom: 1,
        borderRadius: 1.5,
        border : 1,
        height: 70,
      }}
    >
      <Box
        component="div"
        sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center", // Alinea verticalmente
            width: "40%", // Ajusta este valor según el layout deseado
            overflow: "hidden", // Oculta el contenido que sobresale
        }}
      >
      <Image 
        src={commandDetail.dish.image}
        alt={commandDetail.dish.name}
        width={50}
        height={50} />

        <p
            style={{
                marginLeft: 10,
                fontSize: 16,
            }}
        >
            {cutString(commandDetail.dish.name, 16)} 
        </p>
      </Box>

      <Box
        component="div"
        sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center", // Centra los botones en horizontal
            alignItems: "center", // Centra los botones en vertical
            width: "30%", // Ajusta este valor según el layout deseado
        }}
      >
        <IconButton
          onClick={() => decrement(commandDetail.dish.id)}
          color="primary"
          aria-label="minus"
          size="small"
        >
          <RemoveIcon />
        </IconButton>

        {/* <Button
            onClick={() => decrement(commandDetail.dish.id)}

          variant="contained"
          color="primary"
          sx={{
            borderRadius: 1.5,
            padding: 1,
            minWidth: 50,
            minHeight: 50,
            backgroundColor: "primary.main",
            color: "background.default",
          }}
        >
          
        </Button> */}
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 1,
            borderRadius: 1.5,
            border: 1,
            borderColor: "primary.main",
            borderStyle: "solid",
            minWidth: 50,
            minHeight: 50,
          }}
        >
          {count}
        </Box>
        <IconButton
          onClick={() => increment(commandDetail.dish.id)}
          color="primary"
          aria-label="plus"
          size="small"
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end", // Alinea el menú a la derecha
        width: "20%", // Ajusta el ancho
      }}
      >
        <Button
          onClick={
            ev => handleClick(ev)
          }
          color="info"
          aria-label="plus"
          size="small"
          id="basic-button"
        >
          <MoreVertIcon />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            
          >
            <MenuItem
              onClick={() => {
                setCommandDetailsSelected(commandDetail);
                openUpdateFormDialog();
              }}
            >
              <EditIcon
                color="primary"
              />
              Editar
            </MenuItem>
            <MenuItem onClick={() => remove(commandDetail.dish.id)}>
              <DeleteIcon 
                color="error"
              />
              Eliminar
            </MenuItem>
          </Menu>
        </Button> 
      </Box>
    </Box>
  );
}

export default CounterCommand;
