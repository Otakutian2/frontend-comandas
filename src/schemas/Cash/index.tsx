import Yup from "@/schemas/Config";
import { ICashPrincipal } from "@/interfaces/ICash";

const cashSchema: Yup.ObjectSchema<ICashPrincipal> = Yup.object({
  establishmentId: Yup.number()
    .typeError("Debe ser un número")
    .integer()
    .required(),
});

export default cashSchema;
