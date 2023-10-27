import Yup from "@/schemas/Config";

const signInSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export default signInSchema;
