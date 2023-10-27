interface IRolePrincipal {
  name: string;
}

interface IRoleGet extends IRolePrincipal {
  id: number;
}

export type { IRolePrincipal, IRoleGet };
