export enum StatusNumber {
  PENDING = '0',
  FUNDSSENT = '1',
  COMPLETED = '100',
  COMPLETED_2 = '2',
  CANCELED = '-1',
}

export enum CurrencyOptions {
  ETH = 'ETH',
  BTC = 'BTC',
  LTC = 'LTC',
  LTCT = 'LTCT',
}

export interface CoinpaymentsCredentials {
  key: string;
  secret: string;
}

export interface CoinpaymentsCreateTransactionOpts {
  currency1: string;
  currency2: string;
  amount: number;
  buyer_email: string;
  address?: string;
  buyer_name?: string;
  item_name?: string;
  item_number?: string;
  invoice?: string;
  custom?: string;
  ipn_url?: string;
  success_url?: string;
  cancel_url?: string;
}
