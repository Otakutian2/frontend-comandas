interface ICommandStatePrincipal {
  name: string;
}

interface ICommandStateGet extends ICommandStatePrincipal {
  id: number;
}

export type { ICommandStateGet, ICommandStatePrincipal };
