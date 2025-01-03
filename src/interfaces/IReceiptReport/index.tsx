import { ICustomerGet } from "@/interfaces/ICustomer";
import { IReceiptTypeGet } from "@/interfaces/IReceiptType";
import { ICashGet } from "@/interfaces/ICash";
import { ICommandGet } from "../ICommand";

interface IReceiptReportGet {
  id: number;
  createdAt: Date;
  totalPrice: number;
  customer: ICustomerGet;
  receiptType: IReceiptTypeGet;
  command: ICommandGet;
  cash: ICashGet;
}

export interface IAccumulatedPayment {
  paymentMethodName: string;
  totalAmount: number;
}

interface ISalesDataPerDate {
  createdAt: Date;
  accumulatedSales: number;
  numberOfGeneratedReceipts: number;
  quantityOfDishSales: number;
  bestSellingDish: string;
  accumulatedPaymentsByDays: IAccumulatedPayment[];
}

export type { IReceiptReportGet, ISalesDataPerDate };
