import { FormikProps } from "formik/dist/types";

interface IFormProps<T> {
  customRef: React.RefObject<FormikProps<T>>;
}

interface IUpdateFormProps<T, O> extends IFormProps<T> {
  values: O;
}

export type { IFormProps, IUpdateFormProps };
