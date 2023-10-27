import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import React from "react";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import Profile from "../Profile";
import { useTheme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { drawerWidth } from "../SideBar";

interface IHeaderProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  // Crea una transición cuando se abre el drawer
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // Cuando se abre el drawer, se ajusta el margen izquierdo
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
}));

const Header: React.FC<IHeaderProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBarStyled
      open={matchDownMD ? undefined : open}
      position="fixed"
      elevation={0}
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid rgb(240, 240, 240)",
        backgroundColor: "#fff",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "64px",
        }}
      >
        <IconButton color="primary" onClick={handleDrawerToggle}>
          {open ? <FormatIndentDecreaseIcon /> : <FormatIndentIncreaseIcon />}
        </IconButton>

        <Profile />
      </Toolbar>
    </AppBarStyled>
  );
};

export default Header;
