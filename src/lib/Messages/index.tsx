import Typography from "@mui/material/Typography";
import Dangerous from "@mui/icons-material/Dangerous";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import withReactContent, { ReactElementOr } from "sweetalert2-react-content";
import Swal from "sweetalert2";

interface IShowErrorMessage {
  title: string;
  contentHtml?: ReactElementOr<"html">;
}

interface IShowQuestionMessage {
  title: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ReactSwal = withReactContent(Swal);

const showErrorMessage = ({ title, contentHtml }: IShowErrorMessage) => {
  ReactSwal.fire({
    title,
    customClass: {
      icon: "custom-icon",
      actions: "custom-actions",
      cancelButton: "custom-cancel",
    },
    iconHtml: (
      <Dangerous
        sx={{
          display: "block",
          margin: "auto",
          fontSize: "5rem",
        }}
        color="error"
      />
    ),
    html: contentHtml,
    target: "body",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "CERRAR",
  });
};

const showSuccessMessage = (title: string) => {
  ReactSwal.fire({
    title: <Typography fontSize={24}>{title}</Typography>,
    confirmButtonText: "Aceptar",
    icon: "success",
    target: "body",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};

const showWarningMessage = ({ title, contentHtml }: IShowErrorMessage) => {
  ReactSwal.fire({
    title,
    customClass: {
      icon: "custom-icon",
      actions: "custom-actions",
      cancelButton: "custom-confirm-update custom-confirm",
    },
    icon: "warning",
    html: contentHtml,
    target: "body",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "CERRAR",
  });
};

const showInformationMessage = ({ title, contentHtml }: IShowErrorMessage) => {
  ReactSwal.fire({
    title,
    customClass: {
      icon: "custom-icon",
      actions: "custom-actions",
      cancelButton: "custom-confirm-create custom-confirm",
    },
    iconHtml: (
      <HelpCenterIcon
        sx={{
          display: "block",
          margin: "auto",
          fontSize: "5rem",
          color: "#0D6EFD",
        }}
      />
    ),
    html: contentHtml,
    target: "body",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "CERRAR",
  });
};

const showQuestionMessage = ({
  title,
  confirmButtonText = "Salir",
  cancelButtonText = "Cancelar",
}: IShowQuestionMessage) =>
  Swal.fire({
    title,
    customClass: {
      actions: "custom-actions",
      confirmButton: "custom-confirm custom-confirm-create",
      cancelButton: "custom-cancel",
    },
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    allowOutsideClick: false,
    allowEscapeKey: false,
    icon: "question",
  });

const showSuccessToastMessage = (title: string) => {
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  }).fire({
    icon: "success",
    title,
  });
};

export {
  showErrorMessage,
  showSuccessToastMessage,
  showInformationMessage,
  showSuccessMessage,
  showWarningMessage,
  showQuestionMessage,
};
