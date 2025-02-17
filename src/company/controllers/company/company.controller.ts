import { Controller, Post, Get, Patch, Delete, Body, UseGuards, Req, Param } from '@nestjs/common';
import { CompanyService } from '../../services/company/company.service';
import { AuthGuard } from '@nestjs/passport';
import { Company } from '../../../core/entities/company.entity';
import { CurrentUser } from '../../../core/uttils/current-user.decoration';
import { User } from '../../../core/entities/user.entity';
import { CreateCompanyDto } from '../../dtos/company.dto';

@Controller('company')
@UseGuards(AuthGuard('jwt')) // Protéger avec JWT
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(@CurrentUser() user: User, @Body() company: CreateCompanyDto) {
    
    return this.companyService.createCompany(user,company);
  }

  @Get()
  @UseGuards(AuthGuard('jwt')) // Protéger avec JWT
  async getCompanies(@Req() req) {
    return this.companyService.getUserCompany(req.user.id);
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt')) // Protéger avec JWT
  async getCompany(@Param('id') companyId, @Req() req) {
    return this.companyService.getUserCompanyById(companyId);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt')) // Protéger avec JWT
  async updateCompany(@Req() req, @Body() company: CreateCompanyDto) {

    return this.companyService.updateCompany(req.user.id,company);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // Protéger avec JWT
  async deleteCompany(@Param('id') companyId: number, @Req() req) {
    return this.companyService.deleteCompany(companyId, req.user.id);
  }
}
