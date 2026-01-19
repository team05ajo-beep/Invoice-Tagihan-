
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  size: string;
  price: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  projectName: string;
  projectPeriod: string;
  items: InvoiceItem[];
  alreadyPaid: number;
  paymentAccount: string;
  issuerName: string;
  issuerTitle: string;
}
