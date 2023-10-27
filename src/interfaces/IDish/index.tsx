import { ICategoryGet } from "@/interfaces/ICategory";

interface IDishPrincipal {
  name: string;
  price: number;
  image: string;
}

interface IDishCreateOrUpdate extends IDishPrincipal {
  categoryId?: string;
}

interface IDishGet extends IDishPrincipal {
  id: string;
  category: ICategoryGet;
}

interface IDishOrderStatistics {
  dishId: string;
  name: string;
  image: string;
  category: string;
  totalSales: number;
  quantityOfDishesSold: number;
}

export type {
  IDishPrincipal,
  IDishCreateOrUpdate,
  IDishGet,
  IDishOrderStatistics,
};
