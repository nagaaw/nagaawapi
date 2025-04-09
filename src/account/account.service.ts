import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CompanyService } from '../company/services/company/company.service';
import { AuthService } from '../auth/services/auth/auth.service';
import { StockService } from '../stock/services/stock/stock.service';
import { CreateAccountDto } from '../core/dtos/acccount.dto';
import { UserAccessInfo } from '../core/dtos/user.dto';
import { Company } from '../core/entities/company.entity';
import { Stock } from '../core/entities/stock.entity';
import { Category } from '../core/entities/category.entity';
import { CategoryService } from '../core/services/category/category.service';
import { CompanyResponseDto } from '../company/dtos/company.dto';
import { generateReference } from '../core/uttils/generate-reference';
import { HttpStatusCode } from 'axios';
import { UserService } from '../user/user.service';

@Injectable()
export class AccountService {
    private readonly DEFAULT = 'DEFAULT';
    private readonly logger = new Logger(AccountService.name);

    constructor(
        private readonly companyService: CompanyService,
        private readonly authService: AuthService,
        private readonly stockService: StockService,
        private readonly userService: UserService,
        private readonly dataSource: DataSource, // Inject DataSource
        private readonly categoryService: CategoryService,
    ) {}

    /**
     * Create a new account transactionally
     */
    async create(userAccount: CreateAccountDto): Promise<any> {
        const { user, company } = userAccount;

        // Start a transaction
        return await this.dataSource.transaction(async manager => {
            try {
                const userAccessInfo = await this.createUser(user, manager);
                const createdCompany = await this.createCompany(userAccessInfo.user, company, manager);
                await this.createDefaultStock(createdCompany, manager);
                await this.createDefaultCategory(createdCompany, manager);

                return {
                    statusCode: HttpStatusCode.Created,
                    message: 'Account created succesfully'
                }
            } catch (error) {
                
                throw new Error(error || 'Failed to create acccount');
            }
        });
    }

    private async createUser(user: CreateAccountDto['user'], manager: EntityManager): Promise<UserAccessInfo> {
        return this.authService.createUser(user.email, user.phone, user.password);
    }

    private validateUserCreation(user: any): void {
        if (!user) {
            throw new NotFoundException("L'utilisateur n'est pas créé");
        }
    }

    private async createCompany(user: any, company: CreateAccountDto['company'], manager: EntityManager): Promise<Company> {
        return this.companyService.createCompany(user, company, manager);
    }

    private validateCompanyCreation(company: Company): void {
        if (!company) {
            throw new NotFoundException('Company not found');
        }
    }

    private async createDefaultStock(company: Company, manager: EntityManager): Promise<void> {
        const defaultStock = new Stock();
        defaultStock.name = this.DEFAULT;
        defaultStock.description = 'Stock par défaut';
        defaultStock.reference = generateReference('STK');
        defaultStock.company = company;

        await manager.save(defaultStock);
    }

    private async createDefaultCategory(company: Company, manager: EntityManager): Promise<void> {
        const defaultCategory = new Category();
        defaultCategory.company = company;
        defaultCategory.label = this.DEFAULT;
        defaultCategory.description = "Catégorie par defaut";

        await manager.save(defaultCategory);
    }

   
}
