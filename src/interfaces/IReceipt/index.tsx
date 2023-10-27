import { ICashGet } from "../ICash";
import { ICommandGet } from "../ICommand";
import { ICustomerGet } from "../ICustomer";
import { IPaymentMethodGet } from "../IPaymentMethod";
import { IReceiptTypeGet } from "../IReceiptType";

interface IReceiptPrincipal {
  discount: number;
  additionalAmount: number;
}

interface IReceiptCreate extends IReceiptPrincipal {
  commandId: number;
  receiptTypeId: number;
  customerId?: number;
  cashId: number;
  receiptDetailsCollection: IReceiptDetailsCreate[];
}

interface IReceiptGet extends IReceiptPrincipal {
  id: number;
  totalPrice: number;
  igv: number;
  createdAt: string;
  command: ICommandGet;
  customer: ICustomerGet | null;
  receiptType: IReceiptTypeGet;
  cash: ICashGet;
  receiptDetailsCollection: IReceiptDetailsCreate[];
}

interface IReceiptDetailsPrincipal {
  amount: number;
}

interface IReceiptDetailsCreate extends IReceiptDetailsPrincipal {
  paymentMethodId: number;
}

interface IReceiptDetailsGet extends IReceiptDetailsPrincipal {
  id: number;
  paymentMethod: IPaymentMethodGet;
}

interface IReceiptInfo {
  subTotal: number;
  igv: number;
  additionalAmount: number;
  discount: number;
  customer: ICustomerGet | null;
  total: number;
  amountDue: number;
  receiptDetailsCollection: IReceiptDetailsCreate[] | null;
}

interface IReceiptTypeAndCash {
  receiptTypeId?: number;
  cashId?: number;
}

export type {
  IReceiptPrincipal,
  IReceiptCreate,
  IReceiptGet,
  IReceiptDetailsPrincipal,
  IReceiptDetailsCreate,
  IReceiptDetailsGet,
  IReceiptInfo,
  IReceiptTypeAndCash,
};
