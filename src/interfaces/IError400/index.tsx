import { IErrorMessages } from "@/interfaces";

interface IError400 {
  errors: IErrorMessages;
  status: number;
  title: string;
  traceId: string;
  type: string;
}

export default IError400;
