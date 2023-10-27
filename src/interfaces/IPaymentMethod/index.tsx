interface IPaymentMethodPrincipal {
  name: string;
}

interface IPaymentMethodGet extends IPaymentMethodPrincipal {
  id: number;
}

export type { IPaymentMethodPrincipal, IPaymentMethodGet };
