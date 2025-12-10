import Yup from "@/schemas/Config";
import { IDishCreateOrUpdate } from "@/interfaces/IDish";

const dishSchema: Yup.ObjectSchema<IDishCreateOrUpdate> = Yup.object({
  name: Yup.string()
    .min(3)
    .max(50)
    .required(),
  price: Yup.number()
    .typeError("Debe ser un número")
    .moreThan(0)
    .lessThan(400)
    .required(),
  categoryId: Yup.string().required(),
  // AGREGAMOS .required() AQUÍ
  image: Yup.string(), 
  // Probablemente 'active' también deba ser required o tener un valor por defecto
  active: Yup.boolean().default(true), 
});

export default dishSchema;