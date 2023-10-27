import { IRoleGet } from "@/interfaces/IRole";
import { IUserPrincipal } from "@/interfaces/IUser";

interface IEmployeePrincipal {
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
}

interface IEmployeeGet extends IEmployeePrincipal {
  id: number;
  role: IRoleGet;
  user: IUserPrincipal;
  createdAt: string;
}

interface IEmployeeCreateOrUpdate extends IEmployeePrincipal {
  user: IUserPrincipal;
  roleId?: number;
}

export type { IEmployeePrincipal, IEmployeeGet, IEmployeeCreateOrUpdate };
