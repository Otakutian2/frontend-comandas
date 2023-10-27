import Yup from "@/schemas/Config";
import { ITablePrincipal, ITableUpdate } from "@/interfaces/ITable";
import TypeTableState from "@/enum/TypeTableState";

const tableCreateSchema: Yup.ObjectSchema<ITablePrincipal> = Yup.object({
  seatCount: Yup.number().integer().positive().max(9).required(),
});

const tableUpdateSchema: Yup.ObjectSchema<ITableUpdate> = Yup.object({
  seatCount: Yup.number().integer().positive().max(9).required(),
  state: Yup.mixed<TypeTableState>()
    .oneOf(Object.values(TypeTableState))
    .required(),
});

export { tableCreateSchema, tableUpdateSchema };
