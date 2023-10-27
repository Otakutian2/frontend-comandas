import { SvgIcon } from "@mui/material";
import UserRoles from "../UserRoles";

interface IMenuItemsProps {
  text: string;
  href: string;
  Icon: typeof SvgIcon;
  roles?: UserRoles[];
}

export default IMenuItemsProps;
