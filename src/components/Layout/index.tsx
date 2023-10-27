import Main from "@/components/Main";
import SideBar from "@/components/SideBar";
import Box from "@mui/material/Box";
import Header from "../Header";
import { ReactNode, useEffect, useState } from "react";
import { useTheme, useMediaQuery, Toolbar } from "@mui/material";
import { useUserStore } from "@/store/user";

interface ILayoutProps {
  children: ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(!matchDownMD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownMD]);

  return (
    <>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Header open={open} handleDrawerToggle={handleDrawerToggle}></Header>

        <SideBar open={open} handleDrawerToggle={handleDrawerToggle}></SideBar>

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Toolbar />
          <Main>{children}</Main>
        </Box>
      </Box>
    </>
  );
};

const LayoutWrapper: React.FC<ILayoutProps> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return null;
  }

  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;
