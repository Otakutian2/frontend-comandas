import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";
import ContentCenter from "@/components/ContentCenter";

const Welcome = () => {
  return (
    <ContentCenter sxProps={{ flexGrow: 1 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h2">
          Bienvenido a nuestro sistema de comandas
        </Typography>

        <RestaurantMenu sx={{ fontSize: "10rem" }} />
      </Box>
    </ContentCenter>
  );
};

export default Welcome;
