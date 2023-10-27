import DrawerItem from "@/components/DrawerItem";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { SxProps } from "@mui/material/styles";
import { useTheme, useMediaQuery, styled, Theme } from "@mui/material";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface ISideBarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

export const drawerWidth = 280;

const openedMixin = (theme: Theme): any => ({
  width: drawerWidth,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  borderRightStyle: "dashed",
});

const closedMixin = (theme: Theme): any => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: 0,
  borderRight: "none",
  boxShadow: `${theme.shadows[0]}} !important`,
});

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideBar: React.FC<ISideBarProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const drawerRender = (children: React.ReactNode) => {
    if (matchDownMD) {
      return (
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            width: drawerWidth,
            zIndex: 1300,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          onClose={handleDrawerToggle}
        >
          {children}
        </Drawer>
      );
    }

    return (
      <DrawerStyled variant="permanent" open={open}>
        {children}
      </DrawerStyled>
    );
  };

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }}>
      {drawerRender(
        <>
          <SimpleBar style={{ height: "100%" }}>
            <DrawerItem />
          </SimpleBar>
        </>
      )}
    </Box>
  );
};

export default SideBar;
