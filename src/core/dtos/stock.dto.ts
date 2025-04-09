import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateStockDto{
      @IsNotEmpty()
      @IsInt()
      reference: number;
    
      @IsNotEmpty()
      @IsString()
      name: string;
    
      @IsOptional()
      @IsString()
      description?: string;
    
      @IsOptional()
      @IsString()
      localisation?: string;

      

}