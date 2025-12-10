import Yup from "@/schemas/Config";
import {
  ICommandDetailsExtrasGet,
  ICommandPrincipal,
} from "@/interfaces/ICommand";

const createCommandSchemaDynamic = (
  maxSeatCount: number,
  totalOrderPrice?: number
): Yup.ObjectSchema<ICommandPrincipal> => {
  return Yup.object({
    seatCount: Yup.number()
      .typeError("Debe ser un número")
      .moreThan(0)
      .lessThan(maxSeatCount + 1, `La cantidad permitida es ${maxSeatCount}`)
      .required(),
      customerAnonymous : Yup.string().max(150),
      discountType: Yup.string().oneOf(["none", "percentage", "amount"]).required(),
      discount: Yup.number()
        .typeError("Debe ser un número")
        .min(0, "El descuento no puede ser negativo")
        .when("discountType", {
            is: "percentage",
            then: (schema) => schema.max(100, "El descuento porcentual no puede ser mayor a 100"),
        })
        .when("discountType", {
            is: "amount",
            then: (schema) =>
              schema.max(
                totalOrderPrice || Number.MAX_SAFE_INTEGER,
                "El descuento no puede ser mayor al precio total"
              ),
        })
        .when("discountType", {
            is: "none",
            then: (schema) => schema.equals([0], "El descuento debe ser 0 cuando no hay descuento"),
        })
  });
};

interface ICommandDetailsCreateCustom {
  categoryId: string;
  dishId: string;
  // dishQuantity: number;
  observation?: string;
  extras?: ICommandDetailsExtrasGet[];
}

const commandDetailsSchema: Yup.ObjectSchema<ICommandDetailsCreateCustom> =
  Yup.object({
    categoryId: Yup.string().required(),
    dishId: Yup.string().required(),
    // dishQuantity: Yup.number()
    //   .typeError("Debe ser un número")
    //   .moreThan(0)
    //   .lessThan(16)
    //   .required(),
    observation: Yup.string()
      // .matches(
      //   /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,!-]*$/,
      //   "La observación no es válida"
      // )
      .max(150),
    extras: Yup.array()
  });

export { commandDetailsSchema, createCommandSchemaDynamic };
