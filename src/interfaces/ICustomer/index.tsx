interface ICustomerPrincipal {
  firstName: string;
  lastName: string;
  dni: string;
}

interface ICustomerGet extends ICustomerPrincipal {
  id: number;
}

export type { ICustomerPrincipal, ICustomerGet };
