import { IsNotEmpty, IsString } from 'class-validator';
import { CurrencyOptions } from '../types/coin-payment.types';

export class CreateCoinPaymentDto {
  @IsNotEmpty({ message: 'please enter currency' })
  currency: CurrencyOptions;

  @IsString()
  @IsNotEmpty({ message: 'Please add user' })
  userId: string;

  @IsNotEmpty({ message: 'Please add memberships' })
  membershipId: number;

  @IsString()
  @IsNotEmpty({ message: 'please add country-code' })
  country_code: string;
}
