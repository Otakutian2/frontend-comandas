import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import Router from "next/router";
import IMenuItemsProps from "@/interfaces/IMenuItemsProps";

const ListItemButtonLink = ({ text, href, Icon }: IMenuItemsProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={{
          "&.Mui-selected": {
            color: "#0D6EFD",
          },
          "&.Mui-selected .MuiTypography-root": {
            fontWeight: "bolder",
          },
        }}
        LinkComponent={Link}
        href={href}
        selected={href === Router.asPath}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <Icon sx={{ color: "inherit", fontSize: "2rem" }} />
        </ListItemIcon>

        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemButtonLink;
