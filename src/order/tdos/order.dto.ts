import { IsArray, IsNotEmpty, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: "ID du produit" })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 2, description: "Quantité du produit commandé" })
  @IsNumber()
  @IsNotEmpty()
  quantity: number; 
}

export class CreateOrderDto {
  @ApiProperty({ example: 123, description: "ID de l'utilisateur passant la commande" })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    type: [OrderItemDto],
    description: "Liste des articles de la commande",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto {
  @ApiProperty({ 
    example: 'shipped', 
    description: "Nouveau statut de la commande", 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] 
  })
  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status?: string;
}
