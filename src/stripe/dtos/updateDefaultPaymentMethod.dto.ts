import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class DetachpaymentMethodDto {
  @IsString()
  @IsNotEmpty({ message: 'Please add new payment method id' })
  paymentMethodId: string;
}
