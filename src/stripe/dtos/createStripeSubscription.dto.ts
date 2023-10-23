import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentType } from '../types/payment.types';

export class CreateStripeSubscriptionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Please add userId' })
  userId: string;

  // @IsNumber()
  // @IsNotEmpty({ message: 'Please add membershipId' })
  // membershipId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Please add amount' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Please add a paymentMethodId' })
  paymentMethodId: string;

  @IsNotEmpty({ message: 'please add monthly or yearly' })
  paymentType: PaymentType;

  @IsString()
  priceId: string;

  @IsString()
  @IsNotEmpty({ message: 'please add country-code' })
  country_code: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Please add savePaymentMethod value' })
  savePaymentMethod: boolean;
}
