import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Router from "next/router";
import UserRoles from "@/interfaces/UserRoles";
import ListItemButtonLink from "@/components/ListItemButtonLink";
import IMenuItemsWithSubItemsProps from "@/interfaces/IMenuItemsWithSubItemsProps";
import { useToggle } from "@/hooks";
import { useUserStore } from "@/store/user";

const ListItemButtonWithCollapse = ({
  text,
  Icon,
  section,
  items,
}: IMenuItemsWithSubItemsProps) => {
  const user = useUserStore((state) => state.user);
  const [open, toogle] = useToggle(false);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={toogle}
          sx={{
            "&.Mui-selected": {
              color: "#0D6EFD",
            },
            "&.Mui-selected .MuiTypography-root": {
              fontWeight: "bolder",
            },
          }}
          selected={Router.asPath.includes(section)}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Icon sx={{ color: "inherit", fontSize: "2rem" }} />
          </ListItemIcon>

          <ListItemText primary={text} />

          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {items
          .filter(
            (item) =>
              !item.roles || item.roles?.includes(user?.role.name as UserRoles)
          )
          .map((item) => (
            <ListItemButtonLink key={item.text} {...item} />
          ))}
      </Collapse>
    </>
  );
};

export default ListItemButtonWithCollapse;
