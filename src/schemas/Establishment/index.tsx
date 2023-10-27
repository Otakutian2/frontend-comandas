import Yup from "@/schemas/Config";
import { IEstablishmentPrincipal } from "@/interfaces/IEstablishment";

const establishmentSchema: Yup.ObjectSchema<IEstablishmentPrincipal> =
  Yup.object({
    name: Yup.string()
      .min(3)
      .max(50)
      .matches(
        /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*(?:\s[A-ZÁÉÍÓÚÜÑa-záéíóúüñ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*)*$/,
        "La primera letra debe comenzar con mayúscula y tener solo un espacio entre cada palabra"
      )
      .required(),
    phone: Yup.string()
      .matches(/^9\d{8}$/, "Debe ser un número de 9 dígitos y comenzar con 9")
      .required(),
    address: Yup.string()
      .matches(
        /^(?!^\s)[A-Za-z0-9\sÁÉÍÓÚÜÑ.,-]+$/i,
        "La dirección no es válida"
      )
      .required(),
    ruc: Yup.string()
      .matches(
        /^[1-9]\d{10}$/,
        "El RUC debe contener 11 dígitos y no puede empezar con 0"
      )
      .required(),
  });

export default establishmentSchema;
