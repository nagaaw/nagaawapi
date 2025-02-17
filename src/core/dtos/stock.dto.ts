import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateStockDto{
      @IsNotEmpty()
      @IsInt()
      idNumber: number;
    
      @IsNotEmpty()
      @IsString()
      label: string;
    
      @IsOptional()
      @IsString()
      description?: string;
    
      @IsOptional()
      @IsString()
      localisation?: string;

      

}