import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  isNotEmpty,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { PaymentMethod, PaymentType, Status } from '../types/payment.types';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Please add user' })
  user: User;

  @IsString()
  @IsNotEmpty({ message: 'Please add payment_id' })
  payment_id: string;

  @IsNotEmpty({ message: 'Please add amount' })
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Please add payment_method' })
  payment_method: PaymentMethod;

  @IsString()
  invoice_id?: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add payment_type' })
  payment_type: PaymentType;

  @IsString()
  @IsNotEmpty({ message: 'Please add expire_date' })
  expire_date: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add create_date' })
  create_date: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Please add status' })
  status: Status;
}
