import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { CustomButton, CustomTextField } from "@/components/SignInForm";
import { useFormik } from "formik";
import Yup from "@/schemas/Config";
import { AxiosError } from "axios";
import { onlyNumber } from "@/utils";
import axiosObject from "@/services/Axios";
import { showErrorMessage, showSuccessToastMessage } from "@/lib/Messages";
import { IData } from "../ModalRecoveryPassword";

const verifyCodeSchema = Yup.object({
  code: Yup.string()
    .matches(/\b\d{4}\b/, {
      message: "Debe ser 4 dígitos",
      excludeEmptyString: true,
    })
    .required(),
});

interface VerifyCodeProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<React.SetStateAction<IData>>;
  data: IData;
}

const VerifyCode: React.FC<VerifyCodeProps> = ({
  setStep,
  setData,
  data: { email },
}) => {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [seconds]);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validateOnChange: false,
    validationSchema: verifyCodeSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const code = parseInt(values.code);

        const { data } = await axiosObject.post<boolean>(
          "api/user/verify-code",
          {
            email: email,
            code,
          }
        );

        if (!data) {
          setFieldError("code", "El código proporcionado es incorrecto");
          return;
        }

        setData((prev) => {
          return {
            ...prev,
            code,
          };
        });
        setStep(3);
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

  const handleSendCodeAgain = async () => {
    setSeconds(120);

    try {
      const { data } = await axiosObject.post<boolean>("api/user/send-code", {
        email,
      });

      if (!data) {
        showErrorMessage({
          title: "Ocurrió un error",
          contentHtml:
            "Ha ocurrido un error al enviar el código.  Intente nuevamente",
        });
        return;
      }

      showSuccessToastMessage("Se ha enviado el código a tu correo");
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
  };

  return (
    <>
      <DialogTitle
        sx={{
          fontWeight: "bold",
        }}
      >
        El código de verificación ha sido enviado a su correo:
      </DialogTitle>

      <DialogContent sx={{ overflow: "auto", pb: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "justify" }}>
            Ingrese el código de verificación, en caso de que no lo haya
            recibido, presiona{" "}
            {seconds === 0 ? (
              <Link
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleSendCodeAgain();
                }}
              >
                volver a enviar.
              </Link>
            ) : (
              <b>{seconds} segundos.</b>
            )}
          </Typography>

          <form id="form-verify-code" onSubmit={formik.handleSubmit}>
            <CustomTextField
              id="code"
              type="text"
              variant="filled"
              label="Código"
              error={Boolean(formik.errors.code)}
              value={formik.values.code}
              onChange={formik.handleChange}
              onKeyDown={onlyNumber}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                componentsProps: {
                  input: { maxLength: 4 },
                },
              }}
              helperText={formik.errors.code}
              disabled={formik.isSubmitting}
              fullWidth
            />
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pt: 2 }}>
        <CustomButton
          type="submit"
          form="form-verify-code"
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

export default VerifyCode;
