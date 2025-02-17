import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    NotFoundException,
  } from '@nestjs/common';
  import { PaymentService } from './services/payment.service';
import { CreatePaymentDto, ProcessPaymentDto } from './dtos/payment.dto';

  
  @Controller('payments')
  export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
  
    @Post()
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
      return this.paymentService.createPayment(createPaymentDto);
    }
  
    @Patch(':id/process')
    async processPayment(
      @Param('id') id: number,
      @Body() processPaymentDto: ProcessPaymentDto,
    ) {
      return this.paymentService.processPayment(id, processPaymentDto);
    }
  
    @Get(':id')
    async getPayment(@Param('id') id: number) {
      return this.paymentService.getPaymentById(id);
    }
  }