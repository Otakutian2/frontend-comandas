import { IEmployeeGet } from "@/interfaces/IEmployee";

interface IUserPrincipal {
  email: string;
}

interface ICurrentUser extends IEmployeeGet {
  image?: string;
}

export type { IUserPrincipal, ICurrentUser };
