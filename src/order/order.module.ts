import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { Product } from '../core/entities/product.entity';
import { Order } from '../core/entities/order.entity';
import { OrderItem } from '../core/entities/orderitem.entity';
import { Client } from '../core/entities/client.enity';
import { PdfMakerService } from '../core/services/pdf_maker.service';
import { S3Service } from '../upload/services/S3Service.service';
import { Supplier } from '../core/entities/supplier.entity';
import { StockProduct } from '../core/entities/stock_product.entity';
import { ReceiptOrder } from '../core/entities/receipt_order.entity';
import { ReceiptOrderItem } from '../core/entities/receipt_order_item.entity';
import { Stock } from '../core/entities/stock.entity';
import { BillService } from '../core/services/bill/bill.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, Product, Client, Supplier, StockProduct, ReceiptOrder, ReceiptOrderItem, Stock])],
  providers: [OrderService, PdfMakerService, S3Service, BillService],
  controllers: [OrderController]
})
export class OrderModule {}
