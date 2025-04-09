import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Order } from '../core/entities/order.entity';
import { OrderStatus } from '../core/enums/order_status.enum';
import { CreateSaleOrderDto } from './tdos/order.dto';
import { ReceiptOrderDto } from './tdos/receiptOrder.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('sale')
  @ApiOperation({ summary: 'Créer une commande de vente' })
  @ApiBody({ type: CreateSaleOrderDto })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async createSaleOrder(@Body() createOrderDto: CreateSaleOrderDto) {
    const order: Order = await this.orderService.createSaleOrder(createOrderDto);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Créer une commande d\'achat' })
  @ApiBody({ type: CreateSaleOrderDto })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async createPurchaseOrder(@Body() createOrderDto: CreateSaleOrderDto) {
    const order: Order = await this.orderService.createPurchaseOrder(createOrderDto);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Get('purchase/:id') 
  @ApiOperation({ summary: 'Obtenir une commande par ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande trouvée.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async getOrder(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Get('purchase')
  @ApiOperation({ summary: 'Obtenir la liste des commandes d\'achat' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Numéro de la page' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'status', type: String, required: false, enum: OrderStatus, description: 'Statut de la commande' })
  @ApiQuery({ name: 'payment', type: String, required: false, description: 'Méthode de paiement' })
  @ApiQuery({ name: 'reference', type: String, required: false, description: 'Champ de tri' })
  @ApiQuery({ name: 'totalAmount', type: String, required: false, description: 'Champ de tri' })
  @ApiQuery({ name: 'searchKeyWord', type: String, required: false, description: 'Mot-clé de recherche' })
  @ApiResponse({ status: 200, description: 'Commandes trouvées.' })
  @ApiResponse({ status: 404, description: 'Commandes non trouvées.' })
  async getPurchaseOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('payment') payment?: string,
    @Query('reference') reference?: string,
    @Query('totalAmount') totalAmount?: string,
    @Query('createdAt') createdAt?: string,
    @Query('searchKeyWord') searchKeyWord?: string,
  ): Promise<{ data: Order[]; total: number }> {
    const statusParams = status?.split(',') as OrderStatus[];
    const paymentParams = payment?.split(',');
    const sorts: any[] = [];
    if(reference){
      sorts.push({ key: 'reference', value: reference });
    }
    if(totalAmount){
      sorts.push({ key: 'totalAmount', value: totalAmount });
    }

    if(createdAt){
      sorts.push({ key: 'createdAt', value: createdAt });

    }

    return this.orderService.getPurchaseOrders(page, limit, statusParams, paymentParams, sorts, searchKeyWord);
  }

  @Get('sale')
  @ApiOperation({ summary: 'Obtenir la liste des ventes' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Numéro de la page' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'status', type: String, required: false, enum: OrderStatus, description: 'Statut de la commande' })
  @ApiQuery({ name: 'payment', type: String, required: false, description: 'Méthode de paiement' })
  @ApiQuery({ name: 'reference', type: String, required: false, description: 'Champ de tri' })
  @ApiQuery({ name: 'totalAmount', type: String, required: false, description: 'Champ de tri' })
  @ApiQuery({ name: 'createdAt', type: String, required: false, description: 'Champ de tri' })
  @ApiQuery({ name: 'searchKeyWord', type: String, required: false, description: 'Mot-clé de recherche' })
  @ApiResponse({ status: 200, description: 'Ventes trouvées.' })
  @ApiResponse({ status: 404, description: 'Aucune vente trouvée.' })
  async getSaleOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('payment') payment?: string,
    @Query('reference') reference?: string,
    @Query('totalAmount') totalAmount?: string,
    @Query('createdAt') createdAt?: string,
    @Query('searchKeyWord') searchKeyWord?: string,
  ): Promise<{ data: Order[]; total: number }> {
    const statusParams = status?.split(',') as OrderStatus[];
    const paymentParams = payment?.split(',');
    const sorts: any[] = [];
  
    if (reference) {
      sorts.push({ key: 'reference', value: reference });
    }
    if (totalAmount) {
      sorts.push({ key: 'totalAmount', value: totalAmount });
    }
    if (createdAt) {
      sorts.push({ key: 'createdAt', value: createdAt });
    }
  
    return this.orderService.getSaleOrders(page, limit, statusParams, paymentParams, sorts, searchKeyWord);
  }
  

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une commande' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la commande' })
  @ApiBody({ type: Object, description: 'Données de mise à jour de la commande' })
  @ApiResponse({ status: 200, description: 'Commande mise à jour.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async updateOrderStatus(@Param('id') id: number, @Body() updateOrderDto: any) {
    return this.orderService.updateOrderStatus(id, updateOrderDto.status);
  }

  @Post('receipt')
  @ApiOperation({ summary: 'Réceptionner une commande' })
  @ApiBody({ type: ReceiptOrderDto })
  @ApiResponse({ status: 200, description: 'Commande mise à jour.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async receiptOrder(@Body() receiptOrder: ReceiptOrderDto) {
    return this.orderService.receiptOrder(receiptOrder);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une commande' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande supprimée.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Get('bill/:id')
  @ApiOperation({ summary: 'Obtenir la facture d\'une commande' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Facture générée.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  async orderBill(@Param('id') id: number) {
    return await this.orderService.orderBill(id);
  }
}
