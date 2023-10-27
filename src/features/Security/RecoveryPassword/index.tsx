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
import useToggle from "@/hooks/useToggle";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { showErrorMessage, showSuccessMessage } from "@/lib/Messages";
import axiosObject from "@/services/Axios";
import { IData } from "../ModalRecoveryPassword";

const recoveryPassword = Yup.object({
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){7,25}$/,
      "Debe ser una contraseña segura"
    )
    .required(),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
    .required(),
});

interface RecoveryPassword {
  close: () => void;
  data: IData;
}

const RecoveryPassword: React.FC<RecoveryPassword> = ({
  close,
  data: { email, code },
}) => {
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      passwordConfirmation: "",
    },
    validateOnChange: false,
    validationSchema: recoveryPassword,
    onSubmit: async (values) => {
      const { newPassword } = values;

      try {
        const { data } = await axiosObject.post<boolean>(
          "api/user/change-password",
          {
            newPassword: newPassword,
            email,
            code,
          }
        );

        if (!data) {
          showErrorMessage({
            title: "Ocurrió un error",
            contentHtml: "Ha ocurrido un error al cambiar la contraseña",
          });
          return;
        }

        close();
        showSuccessMessage("Contraseña cambiado correctamente");
      } catch (err) {
        const error = err as AxiosError;

        if (error.response?.status === 400) {
          const data = error.response?.data as any;
          const title = data.title;

          showErrorMessage({
            title: "Ocurrió un error",
            contentHtml: `${title}`,
          });
        }
      }
    },
  });

  const [showPassword, toggleShowPassword] = useToggle(false);
  const [showPasswordConfirmation, toggleShowPasswordConfirmation] =
    useToggle(false);

  return (
    <>
      <DialogTitle
        sx={{
          fontWeight: "bold",
        }}
      >
        Restablezca su contraseña:
      </DialogTitle>

      <DialogContent sx={{ overflow: "auto", pb: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "justify" }}>
            Ahora ingrese la nueva constraseña.
            <br />
            Ten en cuenta que una contraseña segura debe cumplir con lo
            siguiente:
            <br />- Mínimo 7 caracteres
            <br />- Máximo 25
            <br />- Al menos una letra mayúscula
            <br />- Al menos una letra minúscula
            <br />- Al menos un dígito
            <br />- No espacios en blanco
            <br />- Al menos 1 caracter especial
          </Typography>

          <form id="form-verify-email" onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <CustomTextField
                sx={{ border: "none" }}
                id="newPassword"
                type={showPassword ? "text" : "password"}
                variant="filled"
                autoComplete="new-password"
                label="Contraseña"
                error={Boolean(formik.errors.newPassword)}
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                helperText={formik.errors.newPassword}
                disabled={formik.isSubmitting}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? (
                          <Visibility fontSize="small" />
                        ) : (
                          <VisibilityOff fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  componentsProps: { input: { maxLength: 25 } },
                }}
              />

              <CustomTextField
                sx={{ border: "none" }}
                id="passwordConfirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                variant="filled"
                autoComplete="new-password"
                label="Confirmar Contraseña"
                error={Boolean(formik.errors.passwordConfirmation)}
                value={formik.values.passwordConfirmation}
                onChange={formik.handleChange}
                helperText={formik.errors.passwordConfirmation}
                disabled={formik.isSubmitting}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPasswordConfirmation}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPasswordConfirmation ? (
                          <Visibility fontSize="small" />
                        ) : (
                          <VisibilityOff fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  componentsProps: { input: { maxLength: 25 } },
                }}
              />
            </Box>
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
          Cambiar Contraseña
        </CustomButton>
      </DialogActions>
    </>
  );
};

export default RecoveryPassword;
