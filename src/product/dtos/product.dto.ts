import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
export class CreateProductDTO {

  
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  price: number;

  @IsOptional()
  @IsArray()
  imgUrls?: string[];

  @IsOptional()
  @IsNumber()
  stockId?: number;


  @IsOptional()
  @IsNumber()
  category?: number;




}

export class UpdateProductDTO {
  
  @IsNotEmpty()
  @IsInt()
  id: number;
  
  @IsNotEmpty()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  price?: number;

  @IsOptional()
  @IsArray()
  imgUrls?: string[];

  @IsOptional()
  @IsNumber()
  stockId?: number;


  @IsOptional()
  @IsNumber()
  category?: number;

}


