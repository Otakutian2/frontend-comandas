import { IDishGet } from "@/interfaces";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";

interface CommandCardProps {
  dish: IDishGet;
  setListDishes: React.Dispatch<React.SetStateAction<ICommandDetailsGet[]>>;
  disabled: boolean;
}

function CommandCard({ dish,setListDishes,disabled }: CommandCardProps) {


    const styleBoxCardCategory = {
        marginRight : 2,
        padding: 1,
        borderRadius: 1.5,
        border : 1,
        borderColor: "primary.main",
        borderStyle: "solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "primary.main",
          color: "background.default",
        },
        transition: "0.5s",
    }
    

  return (
    <>
      <Card
        key={dish.id}
        sx={{
          padding: 1,
          borderRadius: 1.5,
          boxShadow: 1,
          width: {
            xs: "100%",
            md: "180px",
          },
        }}

      >
        <CardMedia
          sx={{
            height: 110,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}

          image={dish.image}
          title={dish.name}
        />
        <CardContent>
          <Typography align="center" flexWrap={"wrap"} gutterBottom variant="body1" component="div">
            {dish.name.toUpperCase()}
          </Typography>
          <Typography align="center" variant="h6" color="text.secondary">
            S/.{dish.price}
          </Typography>

          <Button 
          onClick={() => {
            setListDishes((prev) => {
                const dishFound = prev.find((d) => d.dish.id === dish.id);
                if(dishFound) return prev;

                return [...prev, { dish, dishPrice: dish.price,dishQuantity: 1,orderPrice: dish.price,observation: "" }];

            });
          }}
            disabled={disabled}
          variant="contained" color="primary" fullWidth size="small">
            Agregar
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default CommandCard;
