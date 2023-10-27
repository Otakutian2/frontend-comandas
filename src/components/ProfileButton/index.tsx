import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { MouseEvent } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useUserStore } from "@/store/user";

interface IProfileButtonProps {
  handleOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  anchorEl: HTMLElement | null;
}

const MAX_LENGTH = 14;

const ProfileButton = ({ handleOpen, anchorEl }: IProfileButtonProps) => {
  const user = useUserStore((state) => state.user);
  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <Button
      sx={{
        gap: 1.5,
        display: "flex",
        color: "#000",
      }}
      variant="text"
      endIcon={anchorEl ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      onClick={handleOpen}
    >
      <Avatar sizes="" alt="avatar" src={user?.image ?? ""} />
      <Tooltip title={fullName}>
        <Typography>
          {fullName.length <= MAX_LENGTH
            ? fullName
            : `${fullName.slice(0, MAX_LENGTH)}...`}
        </Typography>
      </Tooltip>
    </Button>
  );
};

export default ProfileButton;
