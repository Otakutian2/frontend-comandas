interface ICategoryPrincipal {
  name: string;
}

interface ICategoryGet extends ICategoryPrincipal {
  id: string;
}

export type { ICategoryPrincipal, ICategoryGet };
