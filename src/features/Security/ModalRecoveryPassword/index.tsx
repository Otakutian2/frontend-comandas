import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import VerifyEmail from "../VeriftyEmail";
import VerifyCode from "../VerifyCode";
import RecoveryPassword from "../RecoveryPassword";

interface ModalRecoveryPasswordProps {
  open: boolean;
  close: () => void;
}

export interface IData {
  email: string;
  code: number;
}

const initialData = {
  email: "",
  code: 0,
};

const ModalRecoveryPassword: React.FC<ModalRecoveryPasswordProps> = ({
  open,
  close,
}) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);

  const closeAndReset = () => {
    close();
    setData(initialData);
    setStep(1);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      scroll="paper"
      sx={{
        zIndex: 1400,
      }}
    >
      <IconButton
        aria-label="close"
        onClick={() => {
          closeAndReset();
        }}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CancelIcon color="primary" fontSize="large" />
      </IconButton>

      {step === 1 && <VerifyEmail setData={setData} setStep={setStep} />}
      {step === 2 && (
        <VerifyCode data={data} setData={setData} setStep={setStep} />
      )}
      {step === 3 && <RecoveryPassword data={data} close={closeAndReset} />}
    </Dialog>
  );
};

export default ModalRecoveryPassword;
