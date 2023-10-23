import { Body, Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { PaypalService } from './paypal.service';
// import { CreateSubscriptionPaymentDto } from './dtos/createPaypalSubscriptionPayment.dto';
import { PaymentType } from 'src/stripe/types/payment.types';
import { Express, Request, Response } from 'express';
import { GetSubscriptionCallBackDto } from './dtos/getSubscriptionCallback.dto';
import { CreateSubscriptionPaymentDto } from './dtos/createPaypalSubscriptionPayment.dto';

@Controller('paypal')
export class PaypalController {
  constructor(private paypalService: PaypalService) {}

  // Generate access token
  @Post('generate-access-token')
  async generateAccessToken() {
    return await this.paypalService.generateAccessToken();
  }

  // Create subscription
  @Post('create-subscription')
  async createSubscriptionPayment(
    @Res({ passthrough: true }) res: Response,
    @Body() createSubscriptionPaymentDto: CreateSubscriptionPaymentDto,
  ) {
    return await this.paypalService.createSubscriptionPayment(
      createSubscriptionPaymentDto,
    );
  }

  // Subscription save
  @Post('subscriptions-save')
  async getSubscriptionCallBack(
    @Res({ passthrough: true }) res: Response,
    @Body() getSubscriptionCallBackDto: GetSubscriptionCallBackDto,
  ) {
    return await this.paypalService.getSubscriptionCallBack(
      getSubscriptionCallBackDto,
    );
  }

  // Subscription webhook
  @Post('subscriptions-webhook')
  async getSubscriptionWebHookCallBack(
    @Body() getSubscriptionWebHookCallBack: any,
    @Headers('paypal-transmission-id') transmission_id: string,
    @Headers('paypal-transmission-time') transmission_time: string,
    @Headers('paypal-transmission-sig') transmission_sig: string,
    @Headers('paypal-cert-url') cert_url: string,
    @Headers('paypal-auth-algo') auth_algo: string,
    @Headers('correlation-id') correlation_id: string,
  ) {
    return await this.paypalService.getSubscriptionWebHookCallBack({
      transmission_id: transmission_id,
      transmission_time: transmission_time,
      transmission_sig: transmission_sig,
      cert_url: cert_url,
      auth_algo: auth_algo,
      correlation_id: correlation_id,
      body: getSubscriptionWebHookCallBack,
    });
  }
}
