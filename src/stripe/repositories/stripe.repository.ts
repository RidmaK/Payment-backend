import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ICustomer } from '../types/stripe.types';
import { UserRepository } from './user.repository';

@Injectable()
export class StripeRepository {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SK'), {
      apiVersion: '2023-08-16',
    });
  }

  // Create customer Id
  async createCustomerId() {
    try {
      const response = await this.stripe.customers.create({
        name: 'Nipuna',
        email: 'amaranayakanipuna@gmail.com',
        address: {
          city: '',
          country: '',
          line1: '',
          line2: '',
          postal_code: '',
        },
        phone: '',
      });

      return response.id;
    } catch (error) {
      throw new Error(`Create customer id error: ${error}`);
    }
  }

  // Retrieve a customer
  async retrieveCustomer(customerId: string) {
    try {
      const response = (await this.stripe.customers.retrieve(
        customerId,
      )) as ICustomer;
      if (!response?.id) {
        throw new ForbiddenException(
          `cannot get the customer ${customerId} at this time`,
        );
      }
      return response;
    } catch (err) {
      throw new Error(`Retrieve customer error: ${err}`);
    }
  }

  // Attach payment method id
  async attachPaymentMethodId(paymentmethodId: string, customerId: string) {
    try {
      const response = await this.stripe.paymentMethods.attach(
        paymentmethodId,
        {
          customer: customerId,
        },
      );

      return response;
    } catch (err) {
      throw new Error(`Attach payment method id error: ${err}`);
    }
  }

  // Create payment method
  async createPaymentMethod() {
    try {
      const response = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 8,
          exp_year: 2024,
          cvc: '3141',
        },
      });

      return response;
    } catch (err) {
      throw new Error(`Create payment method error: ${err}`);
    }
  }

  // Update default payment method
  async updateDefaultPaymentmethod(userId: string, paymentMethodId: string) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new ForbiddenException(`User not found`);
      }

      const { id } = await this.stripe.customers.update(
        user.stripe_customer_id,
        {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        },
      );

      if (!id) {
        throw new ForbiddenException(
          `Cannot update payment method at this time`,
        );
      }

      return {
        id: id,
      };
    } catch (err) {
      throw new Error(`Update default payment method error: ${err}`);
    }
  }

  // Create stripe subscriptioin
  async createSubscription(user: User) {
    try {
      const subscriptionIntent = await this.stripe.subscriptions.create({
        customer: user.stripe_customer_id,
        items: [
          {
            price: 'price_1NpVF7Ap5WSNbPsaU4hAZhtp',
          },
        ],
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscriptionIntent;
    } catch (err) {
      throw new Error(`create stripe subscription error: ${err}`);
    }
  }
}
