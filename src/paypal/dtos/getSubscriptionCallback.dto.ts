import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentType } from 'src/stripe/types/payment.types';

export class GetSubscriptionCallBackDto {
  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @IsNumber()
  @IsNotEmpty()
  membershipId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  paymentType: PaymentType;
}
