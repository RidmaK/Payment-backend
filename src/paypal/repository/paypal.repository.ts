import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { toJSON } from 'flatted';
import { PaymentType } from 'src/stripe/types/payment.types';
import { UserRepository } from 'src/stripe/repositories/user.repository';

@Injectable()
export class PaypalRepository {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
    private readonly userRepository: UserRepository,
  ) {}

  async _genarateAccessToken() {
    try {
      const token = `${this.configService.get<string>(
        'PAYPAL_CLIENT_ID',
      )}:${this.configService.get<string>('PAYPAL_CLIENT_SECRET')}`;
      const encodedToken = Buffer.from(token).toString('base64');
      const res = this.httpService.post(
        `${this.configService.get<string>('PAYPAL_BASE_URL')}/v1/oauth2/token`,
        { grant_type: 'client_credentials' },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedToken}`,
          },
        },
      );
      const response = await firstValueFrom(res).catch((error) => error);
      return toJSON(response.data.access_token);
    } catch (err) {
      console.log(
        `Cannot generate access Token: time=${new Date().getTime()} ${err}`,
      );
      return err;
    }
  }

  async _createSubscription(accessToken: string, planId: string) {
    try {
      const createSubscription = this.httpService.post(
        `${this.configService.get<string>(
          'PAYPAL_BASE_URL',
        )}/v1/billing/subscriptions`,
        {
          plan_id: `${planId}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const response = await firstValueFrom(createSubscription);
      return response.data;
    } catch (err) {
      console.log(
        `Cannot create subscription: userId=${`userId`} time=${new Date().getTime()} ${err}`,
      );

      throw new Error(`getSubscriptionCallBack: ${err} `);
    }
  }

  async _getSubscription(accessToken: string, subscriptionId: string) {
    try {
      const getSubscription = this.httpService.get(
        `${this.configService.get<string>(
          'PAYPAL_BASE_URL',
        )}/v1/billing/subscriptions/${subscriptionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const subscription = await firstValueFrom(getSubscription);

      return subscription;
    } catch (err) {
      console.log(
        `Error in getting subscription CallBack: ${err} time=${new Date().getTime()}`,
      );
      throw new Error(`getSubscriptionCallBack: ${err} `);
    }
  }

  async _verifyWebhookSign(accessToken: string, actualData: any) {
    try {
      const response = await this.httpService.post(
        `${this.configService.get<string>(
          'PAYPAL_BASE_URL',
        )}/v1/notifications/verify-webhook-signature`,
        actualData,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return firstValueFrom(response);
    } catch (err) {
      console.log(
        `Error in verify webhook sign: ${err} time=${new Date().getTime()}`,
      );
      throw new Error(`Error in verify webhook sign: ${err} `);
    }
  }
}
