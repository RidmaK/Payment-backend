export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  CRYPTO = 'CRYPTO',
}
export enum PaymentType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum Status {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  FUNDS_SENT = 'funds_sent',
  ACTIVE = 'active',
}
