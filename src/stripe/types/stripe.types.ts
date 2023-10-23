export interface ICustomer {
  id: string;
  object: string;
  address: any;
  balance: number;
  created: number;
  currency: string;
  default_source: any;
  delinquent: boolean;
  description: any;
  discount: any;
  email: string;
  invoice_prefix: string;
  invoice_settings: InvoiceSettings;
  livemode: boolean;
  metadata: Metadata;
  name: string;
  phone: any;
  preferred_locales: any[];
  shipping: any;
  tax_exempt: string;
  test_clock: any;
}

export interface InvoiceSettings {
  custom_fields: any;
  default_payment_method: string;
  footer: any;
  rendering_options: any;
}

export interface Metadata {}

export enum InvoiceStatus {
  PAID = 'paid',
  OPEN = 'open',
  FAILED = 'failed',
  DRAFT = 'draft',
}
