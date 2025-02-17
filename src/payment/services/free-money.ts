import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FreeMoneyService {
  private readonly apiUrl = 'https://api.freemoney.com';

  async processPayment(transactionId: string): Promise<void> {
    // Process payment using Free Money API
    const response = await axios.post(`${this.apiUrl}/payments`, {
      transactionId,
    });
    if (response.data.status !== 'success') {
      throw new Error('Free Money payment failed.');
    }
  }
}