import Yup from "@/schemas/Config";
import {
  ICommandDetailsCreate,
  ICommandPrincipal,
} from "@/interfaces/ICommand";

const createCommandSchemaDynamic = (
  maxSeatCount: number
): Yup.ObjectSchema<ICommandPrincipal> => {
  return Yup.object({
    seatCount: Yup.number()
      .typeError("Debe ser un número")
      .moreThan(0)
      .lessThan(maxSeatCount + 1, `La cantidad permitida es ${maxSeatCount}`)
      .required(),
  });
};

const commandDetailsSchema: Yup.ObjectSchema<ICommandDetailsCreate> =
  Yup.object({
    categoryId: Yup.string().required(),
    dishId: Yup.string().required(),
    dishQuantity: Yup.number()
      .typeError("Debe ser un número")
      .moreThan(0)
      .lessThan(16)
      .required(),
    observation: Yup.string()
      .matches(
        /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,!-]*$/,
        "La observación no es válida"
      )
      .max(150),
  });

export { commandDetailsSchema, createCommandSchemaDynamic };
