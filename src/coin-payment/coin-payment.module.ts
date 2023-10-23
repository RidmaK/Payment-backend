import { Module } from '@nestjs/common';
import { CoinPaymentController } from './coin-payment.controller';
import { CoinPaymentService } from './coin-payment.service';
import { UserRepository } from 'src/stripe/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/stripe/entities/user.entity';
import { Payment } from 'src/stripe/entities/payment.entity';
import { HttpModule } from '@nestjs/axios';
import { CoinPaymentRepository } from './repository/coin-payment.repository';
import { PaymentRepository } from 'src/stripe/repositories/payment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment]), HttpModule],
  controllers: [CoinPaymentController],
  providers: [
    CoinPaymentService,
    UserRepository,
    CoinPaymentRepository,
    PaymentRepository,
  ],
})
export class CoinPaymentModule {}
