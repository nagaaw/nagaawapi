import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { User } from '../core/entities/user.entity';
import { Company } from '../core/entities/company.entity';
import { Stock } from '../core/entities/stock.entity';
import { Category } from '../core/entities/category.entity';
import { Product } from '../core/entities/product.entity';
import { BusinessModel } from '../core/entities/businessmodel.entity';
import { StockService } from '../stock/services/stock/stock.service';
import { CompanyService } from '../company/services/company/company.service';
import { UserService } from '../core/services/user/user.service';
import { CategoryService } from '../core/services/category/category.service';
import { AuthService } from '../auth/services/auth/auth.service';
import { OpenAIService } from '../core/services/openai/openai.service';
import { LinkedInStrategy } from '../auth/utils/linkedin.strategy';
import { LinkedinService } from '../auth/services/linkedin/linkedin.service';
import { StockProduct } from '../core/entities/stock_product.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    TypeOrmModule.forFeature([User, Company, Stock, Category, Product, BusinessModel, StockProduct]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecretKey', // Fallback to a default key
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    StockService,
    CompanyService,
    UserService,
    CategoryService,
    AuthService,
    OpenAIService,
    LinkedInStrategy,
    LinkedinService
  ],
})
export class AccountModule {}