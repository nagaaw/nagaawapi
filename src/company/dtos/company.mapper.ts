import { plainToInstance } from 'class-transformer';
import { CompanyResponseDto, CreateCompanyDto, UpdateCompanyDto } from '../dtos/company.dto';
import { Company } from '../../core/entities/company.entity';

export class CompanyMapper {
  static toEntity(createCompanyDto: CreateCompanyDto): Company {
    return plainToInstance(Company, createCompanyDto);
  }

  static updateEntity(company: Company, updateCompanyDto: UpdateCompanyDto): Company {
    return Object.assign(company, updateCompanyDto);
  }

  static toDto(company: Company): CompanyResponseDto {
    const companyDto: CompanyResponseDto  = new CompanyResponseDto()
     companyDto.name = company.name;
     companyDto.description = company.description;
     companyDto.sector = company.sector;
     companyDto.id = company.id;
     
    return companyDto;
  }
}
