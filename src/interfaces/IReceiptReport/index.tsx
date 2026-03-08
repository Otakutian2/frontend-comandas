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
  paymentMethodId: number;
  paymentMethodName: string;
  totalAmount: number;
}

export interface IDishPaymentMethodTotal {
  paymentMethodId: number;
  paymentMethodName: string;
  amount: number;
}

export interface IDishSoldData {
  dishId: string;
  dishCategoryId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  
  paymentMethodTotals: IDishPaymentMethodTotal[];
}

export interface IExtraSoldData {
  extraId: string;
  extraCategoryId: string;
  extraName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethodTotals: IDishPaymentMethodTotal[];
}

interface ISalesDataPerDate {
  createdAt: Date;
  accumulatedSales: number;
  numberOfGeneratedReceipts: number;
  quantityOfDishSales: number;
  bestSellingDish: string;
  accumulatedPaymentsByDays: IAccumulatedPayment[];
  soldDishes: IDishSoldData[];
  soldExtras: IExtraSoldData[];
}

export type { IReceiptReportGet, ISalesDataPerDate };
