import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Configure Nodemailer avec Gmail
    this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST'),
        port:  this.configService.get<number>('EMAIL_PORT'),
        secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const companyName = 'Nagaaw';
    const companyAddress = 'Dakar, Ouest Foire';

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Votre Code OTP pour la Vérification de Compte',
      text: `
        Votre code OTP est ${otp}. Il expire dans 15 minutes.

        Entreprise: ${companyName}
        Adresse: ${companyAddress}
      `,
    };

    try {
    await this.transporter.sendMail(mailOptions);
    Logger.log('Email sent successfully')
        
    } catch (error) {
      Logger.debug(error)  
    }

  }

  // Ajoutez d'autres méthodes d'envoi d'email ici si nécessaire
}
