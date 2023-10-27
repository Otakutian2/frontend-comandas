import ProfileButton from "@/components/ProfileButton";
import ProfileMenu from "@/components/ProfileMenu";
import { useAuthStore } from "@/store/auth";
import { useState, MouseEvent } from "react";

const Profile = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ProfileButton handleOpen={handleOpen} anchorEl={anchorEl} />

      <ProfileMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        handleClose={handleClose}
        logout={clearTokens}
      />
    </>
  );
};

export default Profile;
