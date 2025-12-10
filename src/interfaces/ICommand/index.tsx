import DiscountType from "@/enum/DiscountType";
import { ICommandStateGet } from "../ICommandState";
import { IDishGet } from "../IDish";
import { IEmployeeGet } from "../IEmployee";
import { ITableGet } from "../ITable";



interface ICommandPrincipal {
  seatCount?: number;
  customerAnonymous?: string | null;
  discountType?: DiscountType;
  discount?: number | null;
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
  id?: number;
  dishQuantity: number;
  observation?: string;
  uniqueId?: string;
  extras:  ICommandDetailsExtrasGet[];
  dishId?: string;
}

interface ICommandDetailsCreate extends ICommandDetailsPrincipal {
  dishId: string;
}

interface ICommandDetailsGet extends ICommandDetailsPrincipal {
  orderPrice: number;
  dishPrice: number;
  dish: IDishGet;
}

interface ICommandDetailsExtrasPrincipal {
  id?: number;
  commandDetailsId?: number;
  quantity: number;
  extraDishId: string;
}
interface ICommandDetailsExtrasGet extends ICommandDetailsExtrasPrincipal {
  extraDish: IDishGet;
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
  ICommandDetailsExtrasPrincipal,
  ICommandDetailsExtrasGet,
};


