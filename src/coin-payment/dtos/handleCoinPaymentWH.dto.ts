import { IsNotEmpty } from 'class-validator';

export class HandleCoinPaymentWHDto {
  @IsNotEmpty({ message: 'Please add user' })
  userId: string;

  @IsNotEmpty({ message: 'Please add memberships' })
  membershipId: string;
}
