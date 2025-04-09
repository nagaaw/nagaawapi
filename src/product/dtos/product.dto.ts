import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SalesPackaging } from '../../core/entities/sales_packaging.entity';

class SalesPackagingDTO {
  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  purchasePrice: number;

  @IsNotEmpty()
  @IsNumber()
  sellPrice: number;
}

export class CreateProductDTO {
  @IsNotEmpty()
  @IsBoolean()
  storable: boolean;

  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  codeBarre?: string;

  @IsNotEmpty()
  @IsString()
  storageUnit: string;

  @IsOptional()
  @IsNumber()
  cump?: number;

  @IsOptional()
  @IsNumber()
  criticalStorage?: number;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  suppliers?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesPackaging)
  salesPackaging?: SalesPackaging[];

  @IsNotEmpty()
  @IsNumber()
  stockId: number;
}


export class UpdateProductDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  storable?: boolean;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  codeBarre?: string;

  @IsOptional()
  @IsString()
  storageUnit?: string;

  @IsOptional()
  @IsNumber()
  cump?: number;

  @IsOptional()
  @IsNumber()
  criticalStorage?: number;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  suppliers?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesPackaging)
  salesPackaging?: SalesPackaging[];
}