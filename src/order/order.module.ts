import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { Product } from '../core/entities/product.entity';
import { Order } from '../core/entities/order.entity';
import { OrderItem } from '../core/entities/orderitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, Product])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
