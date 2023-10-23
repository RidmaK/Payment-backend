import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCoinPaymentDto } from './dtos/createCoinPayment.dto';
import { UserRepository } from 'src/stripe/repositories/user.repository';
import Coinpayments from 'coinpayments';
import { ConfigService } from '@nestjs/config';
import { CoinPaymentRepository } from './repository/coin-payment.repository';
import { PaymentRepository } from 'src/stripe/repositories/payment.repository';
import {
  PaymentMethod,
  PaymentType,
  Status,
} from 'src/stripe/types/payment.types';
import { HandleCoinPaymentWHDto } from './dtos/handleCoinPaymentWH.dto';
import { StatusNumber } from './types/coin-payment.types';

@Injectable()
export class CoinPaymentService {
  constructor(
    private readonly userRepository: UserRepository,
    private configService: ConfigService,
    private coinPaymentRepository: CoinPaymentRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {
    this.client = new Coinpayments({
      key: this.configService.get<string>('COIN_PAYMENT_KEY'),
      secret: this.configService.get<string>('COIN_PAYMENT_SK'),
    });
  }

  private client: Coinpayments;

  // create coin-payment
  async createCoinPayment(createCoinPaymentDto: CreateCoinPaymentDto) {
    const { currency, userId, membershipId, country_code } =
      createCoinPaymentDto;

    console.log(userId);

    const user = await this.userRepository.findById(userId);

    if (!user) {
      console.log(`user not found ${userId} time=${new Date().getTime()}`);
      throw new Error(`User not found`);
    }

    const createdCoinPayment =
      await this.coinPaymentRepository._createCoinPayment(
        user,
        createCoinPaymentDto,
      );

    if (!createdCoinPayment) {
      console.log(
        `Error when creating the payment  userId=${userId} time=${new Date().getTime()}`,
      );
      throw new Error(`Error when making the coin payment`);
    }

    const createdCoinPaymentInOurDB =
      await this.paymentRepository.createPayment({
        user: user,
        payment_id: createdCoinPayment.txn_id,
        amount: 0.01,
        payment_method: PaymentMethod.CRYPTO,
        payment_type: PaymentType.YEARLY,
        expire_date: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ).toString(),
        create_date: new Date().toString(),
        status: Status.PENDING,
      });

    if (!createdCoinPaymentInOurDB) {
      console.log(
        `Error when creating the payment in our DB  userId=${userId} time=${new Date().getTime()}`,
      );
      throw new Error(
        `Error when creating the payment in our DB  userId=${userId}`,
      );
    }

    return createdCoinPayment;
  }

  // handle coin payment webhook
  async handleCallBackdetails(
    callBackData: any,
    hash: any,
    queryData: HandleCoinPaymentWHDto,
  ) {
    const createdSignature =
      await this.coinPaymentRepository._createSignature(callBackData);

    if (createdSignature !== hash) {
      console.log(
        `cannot continue your request, signature not valid userId=${
          queryData.userId
        } membershipId=${queryData.membershipId} time=${new Date().getTime()}`,
      );
      throw new ForbiddenException('cannot continue your request');
    }

    const { userId, membershipId } = queryData;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      console.log(`user not found ${userId} time=${new Date().getTime()}`);
      throw new Error(`User not found`);
    }

    if (callBackData.status === StatusNumber.PENDING) {
      console.log(`Coin payment webhook response StatusNumber.PENDING`);
    }
    if (callBackData.status === StatusNumber.FUNDSSENT) {
      console.log(`Coin payment webhook response StatusNumber.FUNDSSENT`);
    }
    if (
      callBackData.status === StatusNumber.COMPLETED ||
      callBackData.status === StatusNumber.COMPLETED_2
    ) {
      console.log(
        `Coin payment webhook response StatusNumber.COMPLETED || StatusNumber.COMPLETED_2`,
      );
    }

    if (
      Math.sign(+callBackData.status) === +StatusNumber.CANCELED ||
      Number.isNaN(Math.sign(+callBackData.status))
    ) {
      console.log(`Coin payment webhook response StatusNumber.CANCELED`);
    }
  }

  async sendEmailBefore3DaysForCancellation() {}

  async cancelSubscriptionAfter1Year() {}
}
