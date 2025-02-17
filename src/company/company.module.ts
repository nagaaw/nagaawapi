import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company/company.controller';
import { CompanyService } from './services/company/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { Company } from '../core/entities/company.entity';
import { OpenAIService } from '../core/services/openai/openai.service';
import { BusinessModel } from '../core/entities/businessmodel.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Company, BusinessModel]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, OpenAIService]
})
export class CompanyModule {}
