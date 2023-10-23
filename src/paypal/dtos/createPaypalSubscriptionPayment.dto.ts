import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentType } from 'src/stripe/types/payment.types';
export class CreateSubscriptionPaymentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  membershipId: number;

  @IsNotEmpty()
  paymentType: PaymentType;

  @IsString()
  country_code: string;
}
