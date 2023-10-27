import Yup from "@/schemas/Config";
import { ICustomerPrincipal } from "@/interfaces";

const customerCreateSchema: Yup.ObjectSchema<ICustomerPrincipal> = Yup.object({
  firstName: Yup.string()
    .min(3)
    .max(50)
    .matches(
      /^(?:[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*\s)*[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*$/,
      "Debe comenzar con mayúscula y tener solo un espacio entre cada nombre"
    )
    .required(),
  lastName: Yup.string()
    .min(3)
    .max(50)
    .matches(
      /^(?:[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*\s)*[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*$/,
      "Debe comenzar con mayúscula y tener solo un espacio entre cada apellido"
    )
    .required(),
  dni: Yup.string()
    .matches(/^\d{8}$/, "Debe ser un número de 8 dígitos")
    .required(),
});

export default customerCreateSchema;
