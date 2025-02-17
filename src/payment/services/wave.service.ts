import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WaveService {
  private readonly apiUrl = 'https://api.wave.com';

  async processPayment(transactionId: string): Promise<void> {
    // Process payment using Wave API
    const response = await axios.post(`${this.apiUrl}/payments`, {
      transactionId,
    });
    if (response.data.status !== 'success') {
      throw new Error('Wave payment failed.');
    }
  }
}