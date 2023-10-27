import { signInSchema } from "@/schemas";
import * as yup from "yup";

export default interface ISignIn extends yup.InferType<typeof signInSchema> {}
