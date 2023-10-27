import AddCircle from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";

interface IButtonAddProps {
  text: string;
  openDialog: () => void;
  disabled?: boolean;
}

const ButtonAdd = ({ text, openDialog, disabled }: IButtonAddProps) => {
  return (
    <Button
      variant="contained"
      onClick={openDialog}
      startIcon={<AddCircle />}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default ButtonAdd;
