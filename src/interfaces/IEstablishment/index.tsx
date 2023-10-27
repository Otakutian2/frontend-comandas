interface IEstablishmentPrincipal {
  name: string;
  phone: string;
  address: string;
  ruc: string;
}

interface IEstablishmentGet extends IEstablishmentPrincipal {
  id: number;
}

export type { IEstablishmentPrincipal, IEstablishmentGet };
