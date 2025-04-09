import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from '../core/dtos/acccount.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    /**
     * Create a new account
     * @param createAccountDto - The data required to create an account
     * @returns The created account details
     */
    @Post()
    async create(@Body() createAccountDto: CreateAccountDto): Promise<any> {
        try {
            return  await this.accountService.create(createAccountDto);
        } catch (error) {
            // Handle specific errors or rethrow as HttpException
            throw new HttpException(
                error.message || 'An error occurred while creating the account',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}