import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OrangeSmsService {
  private readonly baseUrl = process.env.ORANGE_BASE_URL;
  private readonly clientId = process.env.ORANGE_CLIENT_ID;
  private readonly clientSecret = process.env.ORANGE_CLIENT_SECRET;
  private readonly senderNumber = process.env.ORANGE_SENDER_NUMBER;

  /**
   * Récupérer le token d'authentification
   */
  async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/oauth/v3/token`,
        `grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
        Logger.debug(error)
      throw new HttpException('Failed to get access token', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Envoyer un SMS
   */
  async sendSms(phoneNumber: string, message: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const payload = {
        outboundSMSMessageRequest: {
          address: `tel:+${phoneNumber}`,
          senderAddress: `tel:+${this.senderNumber}`,
          outboundSMSTextMessage: { message },
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/smsmessaging/v1/outbound/tel%3A%2B${this.senderNumber}/requests`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }
}
