import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { toJSON } from 'flatted';
import { PaypalRepository } from './repository/paypal.repository';
import { CreateSubscriptionPaymentDto } from './dtos/createPaypalSubscriptionPayment.dto';
import { UserRepository } from 'src/stripe/repositories/user.repository';
import { GetSubscriptionCallBackDto } from './dtos/getSubscriptionCallback.dto';
import { CreatePaymentDto } from 'src/stripe/dtos/createPayment.dto';
import {
  PaymentMethod,
  PaymentType,
  Status,
} from 'src/stripe/types/payment.types';
import { PaymentRepository } from 'src/stripe/repositories/payment.repository';

@Injectable()
export class PaypalService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly paypalRepository: PaypalRepository,
    private userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  // Genarated access token
  async generateAccessToken() {
    const genaratedAccessToken =
      await this.paypalRepository._genarateAccessToken();

    return genaratedAccessToken;
  }

  // Create subscription
  async createSubscriptionPayment(
    createSubscriptionPaymentDto: CreateSubscriptionPaymentDto,
  ) {
    const { userId, paymentType, membershipId, country_code } =
      createSubscriptionPaymentDto;

    const genaratedAccessToken =
      await this.paypalRepository._genarateAccessToken();

    const user = await this.userRepository.findById(userId);

    const paypalPlanId = 'P-4SJ857213P076591FMUFKFKY';

    const createdSubscription = await this.paypalRepository._createSubscription(
      genaratedAccessToken,
      paypalPlanId,
    );

    return createdSubscription;
  }

  // Save the pending transaction
  async getSubscriptionCallBack(
    getSubscriptionCallBackDto: GetSubscriptionCallBackDto,
  ) {
    const { subscriptionId, userId, membershipId, paymentType } =
      getSubscriptionCallBackDto;

    const genaratedAccessToken =
      await this.paypalRepository._genarateAccessToken();

    if (!getSubscriptionCallBackDto.subscriptionId) {
      console.log(
        `getSubscriptionCallBack: Subscription Id not found ${
          getSubscriptionCallBackDto.subscriptionId
        } userId=${userId} time=${new Date().getTime()}`,
      );
      throw new Error('Subscription Id not found');
    }

    const fetchedSubsctription = await this.paypalRepository._getSubscription(
      genaratedAccessToken,
      subscriptionId,
    );

    if (!fetchedSubsctription.data) {
      console.log(
        `getSubscriptionCallBack: Subscription not found ${
          fetchedSubsctription.data
        } userId=${userId} time=${new Date().getTime()}`,
      );
      throw new Error('No subscription data found');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      if (!user) {
        console.log(
          `getSubscriptionCallBack: User not found ${user} userId=${userId} time=${new Date().getTime()}`,
        );
        throw new Error(`User id not found ${userId}`);
      }
    }

    const payment = await this.paymentRepository.createPayment({
      user: user,
      payment_id: subscriptionId,
      amount: 100,
      payment_method: PaymentMethod.PAYPAL,
      payment_type: PaymentType.YEARLY,
      expire_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toString(),
      create_date: new Date().toISOString(),
      status: Status.PENDING,
    });

    return payment;
  }

  // handle webhook events
  async getSubscriptionWebHookCallBack(headers: any) {
    const accessToken = await this.paypalRepository._genarateAccessToken();
    const membershipId = 1;
    const post_data = {
      transmission_id: headers.transmission_id,
      transmission_time: headers.transmission_time,
      cert_url: headers.cert_url,
      auth_algo: headers.auth_algo,
      transmission_sig: headers.transmission_sig,
      webhook_id: `${this.configService.get<string>('PAYPAL_WEBHOOK_ID')}`,
      webhook_event: headers.body,
    };

    const actualData = JSON.stringify(post_data);

    const verifyWebhookSign = await this.paypalRepository._verifyWebhookSign(
      accessToken,
      actualData,
    );

    if (verifyWebhookSign.data.verification_status === 'SUCCESS') {
      console.log(headers.body, 'HEADERS>BODY');

      const subs = await headers.body.resource.subscriber;
      console.log(subs, 'SUBS');

      try {
        if (headers.body.event_type === 'BILLING.SUBSCRIPTION.CREATED') {
          console.log('BILLING.SUBSCRIPTION.CREATED***');
        }

        if (headers.body.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
          console.log('BILLING.SUBSCRIPTION.ACTIVATED***');
        }

        if (headers.body.event_type === 'BILLING.SUBSCRIPTION.RE-ACTIVATED') {
          console.log('BILLING.SUBSCRIPTION.RE-ACTIVATED***');
        }

        if (headers.body.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
          console.log('BILLING.SUBSCRIPTION.CANCELLED***');
        }

        if (headers.body.event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
          console.log('BILLING.SUBSCRIPTION.EXPIRED***');
        }

        if (headers.body.event_type === 'BILLING.SUBSCRIPTION.SUSPENDED') {
          console.log('BILLING.SUBSCRIPTION.SUSPENDED***');
        }

        if (headers.body.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.FAILED') {
          console.log('BILLING.SUBSCRIPTION.PAYMENT.FAILED***');
        }

        if (headers.body.event_type === 'PAYMENT.SALE.COMPLETED') {
          console.log('PAYMENT.SALE.COMPLETED***');
        }
      } catch (err) {
        console.log(
          `getSubscriptionWebHookCallBack switch case catch error: ${err}`,
        );
      }
    } else {
      console.log(
        `getSubscriptionWebHookCallBack: Invalid signature ${
          headers.signature
        } time=${new Date().getTime()}`,
      );
      throw new ForbiddenException('Verification failed');
    }
  }
}
