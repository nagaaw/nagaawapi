import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './tdos/order.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Orders') // Catégorie Swagger
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une commande' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une commande par ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande trouvée.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async getOrder(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une commande' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la commande' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Commande mise à jour.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async updateOrderStatus(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrderStatus(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une commande' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande supprimée.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }
}
