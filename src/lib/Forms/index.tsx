import withReactContent, { ReactElementOr } from "sweetalert2-react-content";
import Swal, { SweetAlertCustomClass } from "sweetalert2";

interface IShowFormProps {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  preConfirm: any;
  icon: ReactElementOr<"iconHtml">;
  contentHtml: ReactElementOr<"html">;
  customClass?: string | SweetAlertCustomClass;
}

const ReactSwal = withReactContent(Swal);

const showForm = ({
  title,
  icon,
  contentHtml,
  confirmButtonText,
  cancelButtonText,
  preConfirm,
  customClass,
}: IShowFormProps) => {
  ReactSwal.fire({
    title,
    customClass: {
      icon: "custom-icon",
      actions: "custom-actions",
      confirmButton: "custom-confirm",
      cancelButton: "custom-cancel",
      ...(customClass && typeof customClass === "object" ? customClass : {}),
    },
    iconHtml: icon,
    html: contentHtml,
    target: "body",
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText,
    cancelButtonText,
    preConfirm,
  });
};

export { showForm };
