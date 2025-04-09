import { IsArray, IsNotEmpty, IsNumber } from "class-validator";


export class ReceiptOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

 @IsNotEmpty()
 @IsArray()
 orderItems: OrderItemDto[];

 


}

class OrderItemDto {
    @IsNotEmpty()
    @IsNumber()
    orderItemId: number;
  
    @IsNotEmpty()
    @IsNumber()
    receivedQt: number;
  
    @IsNotEmpty()
    @IsNumber()
    requestedQt: number;

    @IsNotEmpty()
    @IsNumber()
    qtToReceive: number;


}






