interface IReceiptTypePrincipal {
  name: string;
}

interface IReceiptTypeGet extends IReceiptTypePrincipal {
  id: string;
}

export type { IReceiptTypePrincipal, IReceiptTypeGet };
