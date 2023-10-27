import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CustomButton, CustomTextField } from "@/components/SignInForm";
import { useFormik } from "formik";
import Yup from "@/schemas/Config";
import { AxiosError } from "axios";
import axiosObject from "@/services/Axios";
import { showErrorMessage, showSuccessToastMessage } from "@/lib/Messages";
import { IData } from "../ModalRecoveryPassword";

const verifyEmailSchema = Yup.object({
  email: Yup.string().max(50).email().required(),
});

interface VerifyEmailProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<React.SetStateAction<IData>>;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ setStep, setData }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: false,
    validationSchema: verifyEmailSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const email = values.email.toLowerCase();

        await axiosObject.post<boolean>("api/user/verify-email", {
          email,
        });

        const resultSendCode = await axiosObject.post<boolean>(
          "api/user/send-code",
          {
            email,
          }
        );

        if (!resultSendCode.data) {
          showErrorMessage({
            title: "Ocurrió un error",
            contentHtml: "Ha ocurrido un error al enviar el código",
          });
          return;
        }

        setData((prev) => {
          return {
            ...prev,
            email,
          };
        });
        setStep(2);
        showSuccessToastMessage("Se ha enviado un código a tu correo");
      } catch (err) {
        const error = err as AxiosError;

        if (error.response?.status === 404) {
          setFieldError("email", "El correo electrónico no existe");
        }
      }
    },
  });

  return (
    <>
      <DialogTitle
        sx={{
          fontWeight: "bold",
        }}
      >
        ¿Olvidó su contraseña? Sigue estas indicaciones:
      </DialogTitle>

      <DialogContent sx={{ overflow: "auto", pb: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "justify" }}>
            Ingrese la dirección de su correo electrónico con la que está
            registrada su cuenta. Le enviaremos a su correo un código de
            confirmación a la que deberá de ingresar en el formulario para que
            puedas restablecer su contraseña.
          </Typography>

          <form id="form-verify-email" onSubmit={formik.handleSubmit}>
            <CustomTextField
              id="email"
              type="email"
              variant="filled"
              label="Correo Electrónico"
              error={Boolean(formik.errors.email)}
              value={formik.values.email}
              onChange={formik.handleChange}
              helperText={formik.errors.email}
              disabled={formik.isSubmitting}
              InputProps={{
                componentsProps: { input: { maxLength: 50 } },
              }}
              fullWidth
            />
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pt: 2 }}>
        <CustomButton
          type="submit"
          form="form-verify-email"
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={formik.isSubmitting}
        >
          Verificar
        </CustomButton>
      </DialogActions>
    </>
  );
};

export default VerifyEmail;
