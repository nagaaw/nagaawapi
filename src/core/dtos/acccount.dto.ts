import { IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./user.dto";
import { CreateCompanyDto } from "../../company/dtos/company.dto";

export class CreateAccountDto {
  @IsNotEmpty()
  user: CreateUserDto;

  @IsNotEmpty()
  company: CreateCompanyDto
}

