import { IDishGet } from "@/interfaces";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { generateUUID } from "@/utils";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";

interface CommandCardProps {
  dish: IDishGet;
  setListDishes: React.Dispatch<React.SetStateAction<ICommandDetailsGet[]>>;
  disabled: boolean;
}

function CommandCard({ dish,setListDishes,disabled }: CommandCardProps) {


const handleAddDish = useCallback(() => {
    setListDishes((prev) => {
      const newDishDetail: ICommandDetailsGet = {
        dish,
        dishPrice: dish.price,
        dishQuantity: 1,
        orderPrice: dish.price,
        observation: "",
        uniqueId: generateUUID(),
        extras: [],
      };


      return [
        ...prev, 
        newDishDetail,
      ];
    });
  }, [dish, setListDishes]);



  return (
    <Card
      key={dish.id}
      sx={{
        p: 0, 
        borderRadius: 2,
        boxShadow: 3, 
        width: {
          xs: "100%",
          sm: "200px", 
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative', 
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
    >
      
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          sx={{
            height: 120, 
            backgroundSize: "cover", 
            backgroundPosition: "center",
          }}
          image={dish.image}
          title={dish.name}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'primary.main', 
            color: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            lineHeight: 1,
            boxShadow: 2,
            zIndex: 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            S/.{dish.price.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ 
        p: 1.5,  
        flexGrow: 1, // Permite que el contenido ocupe el espacio restante
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:last-child': { pb: 1.5 }, // Asegurar padding consistente en la parte inferior
      }}>
        
        {/* Nombre del Plato */}
        <Typography 
          align="center" 
          gutterBottom 
          variant="subtitle1" 
          component="div"
          sx={{
            fontWeight: 'bold',
            minHeight: '40px', // Altura mínima para evitar saltos en la tarjeta
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2', // Limitar a dos líneas
            WebkitBoxOrient: 'vertical',
            mb: 1, // Reducir margen inferior
          }}
        >
          {dish.name} {/* Dejamos de forzar UPPERCASE para mejor lectura */}
        </Typography>

        {/* El precio ya no está aquí, fue movido al badge */}

        <Button 
          onClick={handleAddDish}
          disabled={disabled}
          variant="contained" 
          color="primary" 
          fullWidth 
          size="medium"
          sx={{ 
            mt: 1, // Margen superior para separarlo del nombre
            textTransform: 'uppercase', // Volver a poner el texto del botón en mayúsculas
          }}
        >
          Agregar
        </Button>
      </CardContent>
    </Card>
    // <Card
    //   sx={{
    //     p: 1, // Shorthand para padding
    //     borderRadius: 1.5,
    //     boxShadow: 3, // Usar un boxShadow un poco más pronunciado para destacar
    //     width: {
    //       xs: "100%",
    //       sm: "200px", // Aumenté el ancho en sm/md para mejor visualización
    //     },
    //     display: 'flex', // Asegura que el contenido se vea bien en varios tamaños
    //     flexDirection: 'column',
    //     justifyContent: 'space-between', // Espacia el contenido de la tarjeta
    //     minHeight: 250, // Asegura una altura mínima uniforme
    //   }}
    // >
    //   <CardMedia
    //     sx={{
    //       height: 120, // Altura un poco mayor para la imagen
    //       backgroundSize: "contain",
    //       backgroundPosition: "center",
    //       objectFit: 'contain', // Asegura que la imagen se ajuste correctamente
    //       // Usar la imagen directamente
    //       backgroundImage: `url(${dish.image})`, 
    //     }}
    //     title={dish.name}
    //   />
    //   <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}> {/* Ajuste de padding de contenido */}
    //     <Typography 
    //       align="center" 
    //       gutterBottom 
    //       variant="subtitle1" 
    //       component="div"
    //       sx={{ 
    //         fontWeight: 'bold',
    //         // Mostrar solo una línea de texto y añadir puntos suspensivos
    //         overflow: 'hidden', 
    //         textOverflow: 'ellipsis',
    //         display: '-webkit-box',
    //         WebkitLineClamp: '2',
    //         WebkitBoxOrient: 'vertical',
    //         minHeight: '40px' // Altura mínima para la tipografía del nombre
    //       }}
    //     >
    //       {dish.name.toUpperCase()}
    //     </Typography>
    //     <Typography 
    //       align="center" 
    //       variant="h6" 
    //       color="primary.main" 
    //       sx={{ mb: 1.5 }} // Margen inferior para separar del botón
    //     >
    //       {/* Formato de moneda específico */}
    //       S/.{dish.price.toFixed(2)} 
    //     </Typography>

    //     <Button 
    //       onClick={handleAddDish}
    //       disabled={disabled}
    //       variant="contained" 
    //       color="primary" 
    //       fullWidth 
    //       size="medium" // Tamaño un poco más grande para el botón
    //     >
    //       Agregar
    //     </Button>
    //   </CardContent>
    // </Card>
  );
}

export default CommandCard;
