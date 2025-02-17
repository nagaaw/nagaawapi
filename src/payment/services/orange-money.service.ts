import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OrangeMoneyService {
  private readonly apiUrl = 'https://api.orange.com';

  async processPayment(transactionId: string): Promise<void> {
    // Process payment using Orange Money API
    const response = await axios.post(`${this.apiUrl}/payments`, {
      transactionId,
    });
    if (response.data.status !== 'success') {
      throw new Error('Orange Money payment failed.');
    }
  }
}