import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../core/entities/payment.entity';
import { User } from '../../core/entities/user.entity';
import { Order } from '../../core/entities/order.entity';
import { CreatePaymentDto, ProcessPaymentDto } from '../dtos/payment.dto';
import { StripeService } from './stripe.service';
import { OrangeMoneyService } from './orange-money.service';
import { WaveService } from './wave.service';
import { FreeMoneyService } from './free-money';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private stripeService: StripeService,
    private orangeMoneyService: OrangeMoneyService,
    private waveService: WaveService,
    private freeMoneyService: FreeMoneyService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { paymentMethod, amount, userId, orderId } = createPaymentDto;

    // Find the user and order
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    // Create the payment record
    const payment = this.paymentRepository.create({
      paymentMethod,
      amount,
      user,
      order,
      status: 'pending',
    });

    return this.paymentRepository.save(payment);
  }

  async processPayment(paymentId: number, processPaymentDto: ProcessPaymentDto): Promise<Payment> {
    const { paymentMethod, transactionId } = processPaymentDto;

    // Find the payment
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found.`);
    }

    // Process payment based on the payment method
    switch (paymentMethod) {
      case 'stripe':
        await this.stripeService.processPayment(transactionId);
        break;
      case 'orange_money':
        await this.orangeMoneyService.processPayment(transactionId);
        break;
      case 'wave':
        await this.waveService.processPayment(transactionId);
        break;
      case 'free_money':
        await this.freeMoneyService.processPayment(transactionId);
        break;
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }

    // Update payment status
    payment.status = 'completed';
    payment.transactionId = transactionId;
    return this.paymentRepository.save(payment);
  }

  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'order'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
    return payment;
  }
}