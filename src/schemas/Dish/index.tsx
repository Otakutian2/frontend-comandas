import Yup from "@/schemas/Config";
import { IDishCreateOrUpdate } from "@/interfaces/IDish";

const dishSchema: Yup.ObjectSchema<IDishCreateOrUpdate> = Yup.object({
  name: Yup.string()
    .min(3)
    .max(50)
    .matches(
      /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*(?:\s[A-ZÁÉÍÓÚÜÑa-záéíóúüñ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ]*)*$/,
      "La primera letra debe comenzar con mayúscula y tener solo un espacio entre cada palabra"
    )
    .required(),
  price: Yup.number()
    .typeError("Debe ser un número")
    .moreThan(0)
    .lessThan(400)
    .required(),
  categoryId: Yup.string().required(),
  image: Yup.string().required(),
});

export default dishSchema;
