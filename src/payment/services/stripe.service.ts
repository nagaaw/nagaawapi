import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async processPayment(transactionId: string): Promise<void> {
    // Process payment using Stripe API
    const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Stripe payment failed.');
    }
  }
}