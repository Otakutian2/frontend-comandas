import Yup from "@/schemas/Config";

const receiptAddAmountSchema = Yup.object({
  amount: Yup.number().typeError("Debe ser un número").moreThan(0).required(),
  paymentMethodId: Yup.number()
    .typeError("Debe ser un número")
    .integer()
    .required(),
});

const receiptAddAdditionalAmountSchema = Yup.object({
  additionalAmount: Yup.number()
    .typeError("Debe ser un número")
    .moreThan(-1)
    .required(),
});

const receiptAddDiscountSchema = Yup.object({
  discount: Yup.number()
    .typeError("Debe ser un número")
    .moreThan(-1)
    .required(),
});

const receiptTypeAndCashShema = Yup.object({
  receiptTypeId: Yup.number()
    .typeError("Debe ser un número")
    .integer()
    .required(),
  cashId: Yup.number().typeError("Debe ser un número").integer().required(),
});

export {
  receiptAddAmountSchema,
  receiptAddAdditionalAmountSchema,
  receiptAddDiscountSchema,
  receiptTypeAndCashShema,
};
