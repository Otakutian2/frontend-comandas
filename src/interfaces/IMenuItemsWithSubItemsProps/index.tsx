import { SvgIcon } from "@mui/material";
import IMenuItemsProps from "@/interfaces/IMenuItemsProps";

interface IMenuItemsWithSubItemsProps {
  text: string;
  Icon: typeof SvgIcon;
  section: string;
  items: IMenuItemsProps[];
}

export default IMenuItemsWithSubItemsProps;
