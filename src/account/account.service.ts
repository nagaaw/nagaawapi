import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CompanyService } from '../company/services/company/company.service';
import { AuthService } from '../auth/services/auth/auth.service';
import { StockService } from '../stock/services/stock/stock.service';
import { UserService } from '../core/services/user/user.service';
import { CreateAccountDto } from '../core/dtos/acccount.dto';
import { UserAccessInfo } from '../core/dtos/user.dto';
import { Company } from '../core/entities/company.entity';
import { Stock } from '../core/entities/stock.entity';
import { Category } from '../core/entities/category.entity';
import { CategoryService } from '../core/services/category/category.service';
import { CompanyResponseDto } from '../company/dtos/company.dto';

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
    async create(userAccount: CreateAccountDto): Promise<CreateAccountDto> {
        const { user, company } = userAccount;

        // Start a transaction
       
            try {
                const userAccessInfo = await this.createUser(user);
                const createdUser = await this.userService.findById(userAccessInfo.user.id);
                this.validateUserCreation(createdUser);

                const createdCompany = await this.createCompany(createdUser, company);
                const foundCompany = await this.companyService.getUserCompanyById(createdCompany.id);
                this.validateCompanyCreation(foundCompany!);

                await this.createDefaultStock(foundCompany!);
                await this.createDefaultCategory(foundCompany!);

                return this.buildCreatedAccountDto(createdUser, createdCompany);
            } catch (error) {
                this.logger.error('Error creating account', error);
                throw error;
            }
    
    }

    private async createUser(user: CreateAccountDto['user']): Promise<UserAccessInfo> {
        return this.authService.createUser('', '', user.email, '', user.password);
    }

    private validateUserCreation(user: any): void {
        if (!user) {
            throw new NotFoundException("L'utilisateur n'est pas créé");
        }
    }

    private async createCompany(user: any, company: CreateAccountDto['company']): Promise<CompanyResponseDto> {
        return this.companyService.createCompany(user, company);
    }

    private validateCompanyCreation(company: Company): void {
        if (!company) {
            throw new NotFoundException('Company not found');
        }
    }

    private async createDefaultStock(company: Company): Promise<void> {
        const defaultStock = new Stock();
        defaultStock.label = this.DEFAULT;
        defaultStock.description = 'Stock par défaut';
        defaultStock.idNumber = 0;
        defaultStock.company = company;

        await this.stockService.createStock(defaultStock);
    }

    private async createDefaultCategory(company: Company): Promise<void> {
        const defaultCategory = new Category();
        defaultCategory.company = company;
        defaultCategory.label = this.DEFAULT;
        defaultCategory.description = "Catégorie par defaut";

        await this.categoryService.create(defaultCategory);
    }

    private buildCreatedAccountDto(user: any, company: CompanyResponseDto): CreateAccountDto {
        const createdAccount = new CreateAccountDto();
        createdAccount.company = company;
        createdAccount.user = user;
        return createdAccount;
    }
}