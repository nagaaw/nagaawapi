import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // e.g., 'orange_money', 'wave', 'free_money', 'stripe'

  @IsNumber()
  @IsNotEmpty()
  amount: number; // Amount to be paid

  @IsNumber()
  @IsNotEmpty()
  userId: number; // User making the payment

  @IsNumber()
  @IsNotEmpty()
  orderId: number; // Order associated with the payment
}


export class ProcessPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // e.g., 'orange_money', 'wave', 'free_money', 'stripe'

  @IsString()
  @IsNotEmpty()
  transactionId: string; // Transaction ID from the payment gateway
}