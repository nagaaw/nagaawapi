import { Module } from '@nestjs/common';
import { ProductsService } from './services/product/product.service';
import { User } from '../core/entities/user.entity';
import { Company } from '../core/entities/company.entity';
import { Product } from '../core/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/product/product.controller';
import { OpenAIService } from '../core/services/openai/openai.service';
import { Stock } from '../core/entities/stock.entity';
import { Category } from '../core/entities/category.entity';
import { CategoryController } from './controllers/category/category.controller';
import { CategoryService } from '../core/services/category/category.service';
import { StockProduct } from '../core/entities/stock_product.entity';
import { Supplier } from '../core/entities/supplier.entity';
import { SalesPackaging } from '../core/entities/sales_packaging.entity';


@Module({
  imports:[
        TypeOrmModule.forFeature([User, Company,Product, Stock, Category, StockProduct, Supplier, SalesPackaging]),
    
  ],
  controllers: [ProductsController, CategoryController, CategoryController],
  providers: [ProductsService, OpenAIService, CategoryService]
})
export class ProductModule {}
