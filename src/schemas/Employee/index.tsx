import Yup from "@/schemas/Config";
import { IEmployeeCreateOrUpdate } from "@/interfaces/IEmployee";

const employeeCreateOrUpdateSchema: Yup.ObjectSchema<IEmployeeCreateOrUpdate> =
  Yup.object({
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
    phone: Yup.string()
      .matches(/^9\d{8}$/, "Debe ser un número de 9 dígitos y comenzar con 9")
      .required(),
    dni: Yup.string()
      .matches(/^\d{8}$/, "Debe ser un número de 8 dígitos")
      .required(),
    roleId: Yup.number().typeError("Debe ser un número").integer().required(),
    user: Yup.object({
      email: Yup.string().max(50).email().required(),
    }),
  });

export default employeeCreateOrUpdateSchema;
