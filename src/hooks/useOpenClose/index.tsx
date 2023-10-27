import { useState, useCallback } from "react";

const useOpenClose = (
  initialState: boolean
): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState<boolean>(initialState);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return [open, handleOpen, handleClose];
};

export default useOpenClose;
