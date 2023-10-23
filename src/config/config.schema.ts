import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(5000).required(),

  BASE_URL: Joi.string().required(),
  FRONTEND_BASE_URL: Joi.string().required(),
  LOCALHOST_FRONTEND_BASE_URL: Joi.string().required(),

  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306).required(),
  DB_USERNAME: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  // DB_REGION: Joi.string().required(),
  // DB_READER_HOST: Joi.string().required(),
  // DB_WRITER_HOST: Joi.string().required(),

  STRIPE_SK: Joi.string().required(),
  STRIPE_WEBHOOK_ENDPOINT_SK: Joi.string().required(),
  STRIPE_USE_TEST_MODE: Joi.string().required(),

  PAYPAL_CLIENT_ID: Joi.string().required(),
  PAYPAL_CLIENT_SECRET: Joi.string().required(),
  PAYPAL_MODE: Joi.string(),
  PAYPAL_BASE_URL: Joi.string().required(),
  PAYPAL_WEBHOOK_ID: Joi.string().required(),

  COIN_PAYMENT_KEY: Joi.string().required(),
  COIN_PAYMENT_SK: Joi.string().required(),
  COIN_PAYMENT_BASE_URL: Joi.string().required(),
  COIN_PAYMENT_MERCHANT_ID: Joi.string().required(),
  COIN_PAYMENT_IPN_SECRET: Joi.string().required(),
});
