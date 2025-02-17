import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl} from "class-validator";
import { User } from "../entities/user.entity";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserResponse{
   @IsNotEmpty() 
   @IsNumber()
   id: number;

   @IsOptional()
   @IsString()
   firstName?: string;

   @IsOptional()
   @IsString()
   lastName?: string;

   @IsNotEmpty()
   @IsString()
   email: string;

   @IsOptional()
   @IsString()
   phone?: string;

   @IsOptional()
   @IsUrl()
   photoUrl?: string;
}

export class UserAccessInfo{
    message: string;
    accessToken: string
    user: UserResponse
}



