import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SelectedProductDto {
  @ApiProperty({ example: 6, description: "ID du produit" })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: "Tissu", description: "Nom du produit" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "m", description: "Unité de mesure" })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ example: 4, description: "Quantité du produit" })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 2000, description: "Prix de vente" })
  @IsNumber()
  @IsNotEmpty()
  salePrice: number;

  @ApiProperty({ example: 0, description: "Remise sur le produit" })
  @IsNumber()
  @IsOptional()
  discount: number;

  @ApiProperty({ example: 0, description: "TVA appliquée" })
  @IsNumber()
  @IsOptional()
  tva: number;
}

export class CreateSaleOrderDto {
  @ApiProperty({ example: 1, description: "ID du client" })
  @IsNumber()
  @IsNotEmpty()
  client: number;

  @ApiProperty({ example: "2025-03-03T22:04:34.277Z", description: "Date de la commande" })
  @IsDateString()
  @IsNotEmpty()
  orderDate: string;

  @ApiProperty({ example: "2025-03-04T22:05:01.655Z", description: "Date de réception prévue" })
  @IsDateString()
  @IsOptional()
  receiptDate: string;

  @ApiProperty({ example: 1, description: "Mode de livraison" })
  @IsNumber()
  @IsNotEmpty()
  delivery: number;

  @ApiProperty({ example: "om", description: "Mode de paiement" })
  @IsString()
  @IsNotEmpty()
  payment: string;

  @ApiProperty({ type: [SelectedProductDto], description: "Liste des produits sélectionnés" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedProductDto)
  selectedProducts: SelectedProductDto[];
}
