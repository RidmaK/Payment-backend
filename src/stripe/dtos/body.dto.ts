import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BodyDto {
  @IsString()
  @IsNotEmpty({ message: 'Please add payment method id' })
  id: string;
}
