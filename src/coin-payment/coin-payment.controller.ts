import {
  Body,
  Controller,
  Post,
  Query,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { CoinPaymentService } from './coin-payment.service';
import { CreateCoinPaymentDto } from './dtos/createCoinPayment.dto';
import { CurrencyOptions } from './types/coin-payment.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { HandleCoinPaymentWHDto } from './dtos/handleCoinPaymentWH.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('coin-payment')
export class CoinPaymentController {
  constructor(private readonly coinPaymentService: CoinPaymentService) {}

  // Generate access token
  @Post('create')
  async createCoinPayment() {
    // @Body() createCoinPaymentDto: CreateCoinPaymentDto
    const createCoinPaymentDto: CreateCoinPaymentDto = {
      userId: 'edc4abc1-7b41-4e07-b67f-b88e019b6321',
      membershipId: 1,
      currency: CurrencyOptions.LTCT,
      country_code: 'USA',
    };

    return await this.coinPaymentService.createCoinPayment(
      createCoinPaymentDto,
    );
  }

  // Listen to the IPN url
  @Post('coin-payment-webhook')
  @UseInterceptors(FileInterceptor('file'))
  async listenCoinPaymentWebhook(
    @Body() callBackData: any,
    @Query() queryData: HandleCoinPaymentWHDto,
    @Headers('hmac') hmac: any,
  ) {
    return await this.coinPaymentService.handleCallBackdetails(
      callBackData,
      hmac,
      queryData,
    );
  }

  //sendEmailBefore3DaysForCancellation
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async sendEmailBefore3DaysForCancellation() {
    return await this.coinPaymentService.sendEmailBefore3DaysForCancellation();
  }

  //cancelSubscriptionAfter1Year
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async cancelSubscriptionAfter1Year() {
    return await this.coinPaymentService.cancelSubscriptionAfter1Year();
  }
}
