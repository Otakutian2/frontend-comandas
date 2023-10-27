import Yup from "@/schemas/Config";
import { ICategoryPrincipal } from "@/interfaces/ICategory";

const categorySchema: Yup.ObjectSchema<ICategoryPrincipal> = Yup.object({
  name: Yup.string()
    .min(3)
    .max(50)
    .matches(
      /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*(?:\s[A-ZÁÉÍÓÚÜÑa-záéíóúüñ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*)*$/,
      "La primera letra debe comenzar con mayúscula y tener solo un espacio entre cada palabra"
    )
    .required(),
});

export default categorySchema;
