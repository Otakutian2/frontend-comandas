import { ICustomerGet } from "@/interfaces/ICustomer";
import { IReceiptTypeGet } from "@/interfaces/IReceiptType";
import { IEmployeeGet } from "@/interfaces/IEmployee";
import { ICashGet } from "@/interfaces/ICash";

interface IReceiptReportGet {
  id: number;
  createdAt: Date;
  totalPrice: number;
  customer: ICustomerGet;
  receiptType: IReceiptTypeGet;
  employee: IEmployeeGet;
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
