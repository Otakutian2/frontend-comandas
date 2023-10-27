import Box from "@mui/material/Box";
import { ReactNode } from "react";

interface IMainProps {
  children: ReactNode;
}

const Main = ({ children }: IMainProps) => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        gap: 2,
        padding: "1rem",
      }}
    >
      {children}
    </Box>
  );
};

export default Main;
