import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';
import { OrangeMoneyService } from './services/orange-money.service';
import { WaveService } from './services/wave.service';
import { FreeMoneyService } from './services/free-money';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { Company } from '../core/entities/company.entity';
import { Product } from '../core/entities/product.entity';
import { Stock } from '../core/entities/stock.entity';
import { Category } from '../core/entities/category.entity';
import { StockProduct } from '../core/entities/stock_product.entity';
import { Payment } from '../core/entities/payment.entity';
import { Order } from '../core/entities/order.entity';
import { OrderItem } from '../core/entities/orderitem.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Company,Product, Stock, Category, StockProduct, Payment, Order, OrderItem]),
    
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StripeService,
    OrangeMoneyService,
    WaveService,
    FreeMoneyService,
  ]
})
export class PaymentModule {}
