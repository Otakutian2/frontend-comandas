import { ICommandStateGet } from "../ICommandState";
import { IDishGet } from "../IDish";
import { IEmployeeGet } from "../IEmployee";
import { ITableGet } from "../ITable";

interface ICommandPrincipal {
  seatCount?: number;
}

interface ICommandCreate extends ICommandPrincipal {
  tableRestaurantId?: number;
  commandDetailsCollection: ICommandDetailsCreate[];
}

interface ICommandUpdate extends ICommandPrincipal {
  commandDetailsCollection: ICommandDetailsCreate[];
}

interface ICommandGet extends ICommandPrincipal {
  id: number;
  totalOrderPrice: number;
  createdAt: string;
  tableRestaurant: ITableGet;
  commandState: ICommandStateGet;
  employee: IEmployeeGet;
  commandDetailsCollection: ICommandDetailsGet[];
}

interface ICommandForTable {
  id: number;
  totalOrderPrice: number;
  createdAt: string;
  commandState: ICommandStateGet;
  employee: IEmployeeGet;
  quantityOfDish: number;
}

interface ICommandDetailsPrincipal {
  dishQuantity: number;
  observation?: string;
}

interface ICommandDetailsCreate extends ICommandDetailsPrincipal {
  dishId: string;
}

interface ICommandDetailsGet extends ICommandDetailsPrincipal {
  orderPrice: number;
  dishPrice: number;
  dish: IDishGet;
}

export type {
  ICommandPrincipal,
  ICommandCreate,
  ICommandUpdate,
  ICommandGet,
  ICommandForTable,
  ICommandDetailsPrincipal,
  ICommandDetailsCreate,
  ICommandDetailsGet,
};
