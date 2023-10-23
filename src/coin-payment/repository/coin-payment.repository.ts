import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { toJSON } from 'flatted';
import { PaymentType } from 'src/stripe/types/payment.types';
import { UserRepository } from 'src/stripe/repositories/user.repository';
import Coinpayments from 'coinpayments';
import { CreateCoinPaymentDto } from '../dtos/createCoinPayment.dto';
import { User } from 'src/stripe/entities/user.entity';

@Injectable()
export class CoinPaymentRepository {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
    private readonly userRepository: UserRepository,
  ) {
    this.client = new Coinpayments({
      key: this.configService.get<string>('COIN_PAYMENT_KEY'),
      secret: this.configService.get<string>('COIN_PAYMENT_SK'),
    });
  }

  private client: Coinpayments;

  async _createCoinPayment(
    user: User,
    createCoinPaymentDto: CreateCoinPaymentDto,
  ) {
    try {
      const { currency, userId, membershipId, country_code } =
        createCoinPaymentDto;

      const response = await this.client.createTransaction({
        currency1: 'USD',
        currency2: currency,
        amount: 0.01,
        buyer_email: user.email,
        buyer_name: `${user.first_name} ${user.last_name}`,
        custom: 'test-nipuna-coin-payments',
        ipn_url: `https://webhook.site/a4337187-8c5c-4958-bf8f-aca8fc9bc04f`,
      });

      return response;
    } catch (err) {
      console.log(
        `Error in create coin payment: ${err} time=${new Date().getTime()}`,
      );
      throw new Error(`getSubscriptionCallBack: ${err} `);
    }
  }

  async _createSignature(callBackData: any) {
    try {
      const hmac = createHmac(
        'sha512',
        this.configService.get<string>('COIN_PAYMENT_IPN_SECRET'),
      );

      const _data = new URLSearchParams(callBackData).toString();

      const data = hmac.update(_data);

      const signature = data.digest('hex');

      return signature;
    } catch (err) {
      console.log(
        `Error in create coin payment signature: ${err} time=${new Date().getTime()}`,
      );
      throw new Error(`Coin payment create signature error: ${err} `);
    }
  }
}
