import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ICustomer } from '../types/stripe.types';
import { UserRepository } from './user.repository';
import { CreatePaymentDto } from '../dtos/createPayment.dto';
import { Payment } from '../entities/payment.entity';
import { Status } from '../types/payment.types';

@Injectable()
export class PaymentRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  // Create customer Id
  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const newPayment = this.paymentRepository.create({ ...createPaymentDto });
      return this.paymentRepository.save(newPayment);
    } catch (error) {
      throw new Error(`Create payment error: ${error}`);
    }
  }

  // Find one by paymentId
  async findOneByPaymentId(id: string): Promise<Payment[]> {
    try {
      const payments = await this.paymentRepository.find({
        where: { payment_id: id },
        relations: ['user'],
      });

      return payments;
    } catch (error) {
      throw new Error('find one by paymentId error');
    }
  }

  // Update payment
  async updatePayment(payment: Payment, status: Status): Promise<Payment> {
    try {
      payment.status = status;
      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new Error('Method not implemented.');
    }
  }
}
