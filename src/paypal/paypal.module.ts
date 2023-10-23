import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { HttpModule } from '@nestjs/axios';
import { PaypalRepository } from './repository/paypal.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/stripe/entities/user.entity';
import { Payment } from 'src/stripe/entities/payment.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { UserRepository } from 'src/stripe/repositories/user.repository';
import { PaymentRepository } from 'src/stripe/repositories/payment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment]), HttpModule],
  controllers: [PaypalController],
  providers: [
    PaypalService,
    PaypalRepository,
    UserRepository,
    PaymentRepository,
  ],
})
export class PaypalModule {}
