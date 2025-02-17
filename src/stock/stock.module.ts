import { Module } from '@nestjs/common';
import { StockService } from './services/stock/stock.service';
import { StockController } from './controllers/stock/stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { Company } from '../core/entities/company.entity';
import { Product } from '../core/entities/product.entity';
import { Stock } from '../core/entities/stock.entity';
import { StockProduct } from '../core/entities/stock_product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company,Product, Stock, StockProduct]),
    
  ],
  providers: [StockService],
  controllers: [StockController]
})
export class StockModule {}
