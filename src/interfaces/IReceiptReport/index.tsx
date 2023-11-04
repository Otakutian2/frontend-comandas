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

interface ISalesDataPerDate {
  createdAt: Date;
  accumulatedSales: number;
  numberOfGeneratedReceipts: number;
  quantityOfDishSales: number;
  bestSellingDish: string;
}

export type { IReceiptReportGet, ISalesDataPerDate };
