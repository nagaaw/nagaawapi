import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './core/entities/user.entity';
import { ProjectModule } from './project/project.module';
import { Company } from './core/entities/company.entity';
import { CompanyModule } from './company/company.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './core/entities/product.entity';
import { OpenAIService } from './core/services/openai/openai.service';
import { BusinessModel } from './core/entities/businessmodel.entity';
import { StockModule } from './stock/stock.module';
import { Stock } from './core/entities/stock.entity';
import { Category } from './core/entities/category.entity';
import { CategoryService } from './core/services/category/category.service';
import { StockProduct } from './core/entities/stock_product.entity';
import { StockService } from './core/services/stock/stock.service';
import { AccountModule } from './account/account.module';
import { OrderModule } from './order/order.module';
import { Order } from './core/entities/order.entity';
import { OrderItem } from './core/entities/orderitem.entity';
import { PaymentModule } from './payment/payment.module';
import { Payment } from './core/entities/payment.entity';
import { UploadModule } from './upload/upload.module';
import { ClientModule } from './client/client.module';
import { SupplierController } from './supplier/supplier.controller';
import { SupplierModule } from './supplier/supplier.module';
import { Client } from './core/entities/client.enity';
import { Supplier } from './core/entities/supplier.entity';
import { SalesPackaging } from './core/entities/sales_packaging.entity';
import { PdfMakerService } from './core/services/pdf_maker.service';
import { S3Service } from './upload/services/S3Service.service';
import { ReceiptOrder } from './core/entities/receipt_order.entity';
import { ReceiptOrderItem } from './core/entities/receipt_order_item.entity';
import { UserModule } from './user/user.module';
import { OrangeSmsService } from './core/services/sms/orange-sms.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forFeature([
      User,
      Company,
      Product,
      BusinessModel,
      Stock,
      Category,
      StockProduct,
      Supplier,
      Client
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Company,
        Product,
        BusinessModel,
        Stock,
        Category,
        StockProduct,
        Order,
        OrderItem,
        Payment,
        Supplier,
        Client,
        SalesPackaging,
        ReceiptOrder,
        ReceiptOrderItem
        
      ],
      synchronize: true,
    }),
    ProjectModule,
    CompanyModule,
    ProductModule,
    StockModule,
    AccountModule,
    OrderModule,
    PaymentModule,
    UploadModule,
    ClientModule,
    SupplierModule,
    UserModule,
  ],
  providers: [
    OpenAIService,
    PdfMakerService,
    S3Service
  ],
})
export class AppModule {}
