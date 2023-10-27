import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Logout from "@mui/icons-material/Logout";
import AssignmentInd from "@mui/icons-material/AssignmentInd";
import Link from "next/link";

interface IProfileMenuProps {
  logout: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

const ProfileMenu = ({
  logout,
  open,
  anchorEl,
  handleClose,
}: IProfileMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem component={Link} href={"/account"}>
        <ListItemIcon>
          <AssignmentInd />
        </ListItemIcon>
        <ListItemText>Mi Cuenta</ListItemText>
      </MenuItem>
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText>Cerrar Sesión</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
