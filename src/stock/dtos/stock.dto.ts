import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

export class CreateStockProductDto{
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    stockId: number;
}