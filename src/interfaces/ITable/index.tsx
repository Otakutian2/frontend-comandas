import { TypeTableState } from "@/enum";
import { ICommandForTable } from "../ICommand";

interface ITablePrincipal {
  seatCount: number;
}

interface ITableUpdate extends ITablePrincipal {
  state: TypeTableState;
}

interface ITableGet extends ITablePrincipal {
  id: number;
  state: string;
}

type TableState = "Libre" | "Ocupado";

interface ITableWithCommand {
  table?: ITableGet;
  command?: ICommandForTable;
}

export type {
  ITablePrincipal,
  ITableUpdate,
  ITableGet,
  ITableWithCommand,
  TableState,
};
