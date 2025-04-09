import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '../core/entities/order.entity';
import { Product } from '../core/entities/product.entity';
import { OrderItem } from '../core/entities/orderitem.entity';
import { OrderType } from '../core/enums/order_type.enum';
import { OrderStatus } from '../core/enums/order_status.enum';
import { BillService } from '../core/services/bill/bill.service';
import { S3Service } from '../upload/services/S3Service.service';
import { StockProduct } from '../core/entities/stock_product.entity';
import { Payment } from '../core/entities/payment.entity';
import { PaymentStatus } from '../core/enums/payment_status.enum';
import { ReceiptOrderItem } from '../core/entities/receipt_order_item.entity';
import { OrderReceiptStatus } from '../core/enums/order_receipt_status';
import { ReceiptOrder } from '../core/entities/receipt_order.entity';
import { Stock } from '../core/entities/stock.entity';
import { Client } from '../core/entities/client.enity';
import { CreateSaleOrderDto } from './tdos/order.dto';
import { generateReference } from '../core/uttils/generate-reference';
import { ReceiptOrderDto } from './tdos/receiptOrder.dto';
import { log } from 'console';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ReceiptOrder)
    private receiptRepository: Repository<ReceiptOrder>,
    @InjectRepository(StockProduct)
    private stockProductRepository: Repository<StockProduct>,
    private readonly billService: BillService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly s3Service: S3Service
  ) {}

  async createSaleOrder(orderData: CreateSaleOrderDto): Promise<Order> {
    return this.createOrder(orderData, OrderType.SALE);
  }

  async createPurchaseOrder(orderData: CreateSaleOrderDto): Promise<Order> {
    return this.createOrder(orderData, OrderType.PURCHASE);
  }

  private async createOrder(orderData: any, orderType: OrderType): Promise<Order> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const order = this.createOrderEntity(orderData, orderType);
      const savedOrder = await transactionalEntityManager.save(Order, order);

      for (const productData of orderData.selectedProducts) {
        const product = await this.getProductById(transactionalEntityManager, productData.id);
        const stockProduct = await this.getOrCreateStockProduct(transactionalEntityManager, product, productData.stockId);

        this.updateStockProductQuantity(stockProduct, productData.quantity, orderType);
        await transactionalEntityManager.save(StockProduct, stockProduct);

        const orderItem = this.createOrderItem(savedOrder, product, productData);
        await transactionalEntityManager.save(OrderItem, orderItem);
      }

      const payment = this.createPayment(savedOrder, orderData.payment, order.totalAmount!);
      await transactionalEntityManager.save(Payment, payment);

      return savedOrder;
    });
  }

  private createOrderEntity(orderData: any, orderType: OrderType): Order {
    const order = new Order();
    order.client = orderType === OrderType.SALE ? { id: orderData.client } as any : undefined;
    order.supplier = orderType === OrderType.PURCHASE ? { id: orderData.supplier } as any : undefined;
    order.orderDate = new Date(orderData.orderDate);
    order.receiptDate = new Date(orderData.receiptDate);
    order.status = OrderStatus.PENDING;
    order.type = orderType;
    order.reference = generateReference('ORD');
    order.totalAmount = orderType === OrderType.PURCHASE
      ? this.calculatePurchaseTotalAmount(orderData.selectedProducts)
      : this.calculateSaleTotalAmount(orderData.selectedProducts);
    return order;
  }

  private calculatePurchaseTotalAmount(selectedProducts: any[]): number {
    return selectedProducts.reduce((total, product) => total + (product.quantity * product.purchasePrice), 0);
  }

  private calculateSaleTotalAmount(selectedProducts: any[]): number {
    return selectedProducts.reduce((total, product) => total + (product.quantity * product.salePrice), 0);
  }

  private async getProductById(transactionalEntityManager: EntityManager, productId: number): Promise<Product> {
    const product = await transactionalEntityManager.findOne(Product, { where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }

  private async getOrCreateStockProduct(transactionalEntityManager: EntityManager, product: Product, stockId?: number): Promise<StockProduct> {
    let stockProduct = await transactionalEntityManager.findOne(StockProduct, { where: { product: { id: product.id } } });
    if (!stockProduct) {
      stockProduct = new StockProduct();
      stockProduct.product = product;
      stockProduct.stock = await this.getStockById(transactionalEntityManager, stockId || 1);
    }
    return stockProduct;
  }

  private async getStockById(transactionalEntityManager: EntityManager, stockId: number): Promise<Stock> {
    const stock = await transactionalEntityManager.findOne(Stock, { where: { id: stockId } });
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${stockId} not found`);
    }
    return stock;
  }

  private updateStockProductQuantity(stockProduct: StockProduct, quantity: number, orderType: OrderType) {
    if (orderType === OrderType.SALE && stockProduct.quantity < quantity) {
      throw new ConflictException(`Quantity out of stock for product with ID: ${stockProduct.product.id}`);
    }
    stockProduct.quantity = orderType === OrderType.SALE
      ? stockProduct.quantity - quantity
      : stockProduct.quantity + quantity;
  }

  private createOrderItem(order: Order, product: Product, productData: any): OrderItem {
    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.product = product;
    orderItem.quantity = productData.quantity;
    orderItem.unit = productData.unit;
    orderItem.price = productData.salePrice || productData.purchasePrice;
    orderItem.discount = productData.discount;
    orderItem.tva = productData.tva;
    orderItem.total = orderItem.price * orderItem.quantity;
    return orderItem;
  }

  private createPayment(order: Order, paymentMethod: string, amount: number): Payment {
    const payment = new Payment();
    payment.order = order;
    payment.paymentMethod = paymentMethod;
    payment.status = PaymentStatus.PENDING;
    payment.amount = amount;
    return payment;
  }

  async getPurchaseOrders(page: number, limit: number, status?: OrderStatus[], payment?: string[], sort?: any[], searchKeyWord?: string): Promise<{ data: Order[]; total: number }> {
    return this.getOrders(OrderType.PURCHASE, page, limit, status, payment, sort, searchKeyWord);
  }

  async getSaleOrders(page: number, limit: number, status?: OrderStatus[], payment?: string[], sort?: any[], searchKeyWord?: string): Promise<{ data: Order[]; total: number }> {
    return this.getOrders(OrderType.SALE, page, limit, status, payment, sort,searchKeyWord);
  }

  private async getOrders(
    orderType: OrderType,
    page: number,
    limit: number,
    status?: OrderStatus[],
    payment?: string[],
    sort?: any[],
    searchKeyWord?: string
  ): Promise<{ data: Order[]; total: number }> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.supplier', 'supplier')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.payment', 'payment')
      .where('order.type = :type', { type: orderType });

    if (status && status.length > 0) {
      query.andWhere('order.status IN (:...status)', { status });
    }

    if (payment && payment.length) {
      query.andWhere('payment.paymentMethod IN (:...payment)', { payment });
    }

    if (searchKeyWord) {
      query.andWhere(
        `(order.reference LIKE :searchKeyWord OR
       DATE_FORMAT(order.orderDate, '%Y-%m-%d') LIKE :searchKeyWord OR
       supplier.firstName LIKE :searchKeyWord OR
       supplier.lastName LIKE :searchKeyWord OR
       client.firstName LIKE :searchKeyWord OR
       client.lastName LIKE :searchKeyWord)`,
      { searchKeyWord: `%${searchKeyWord}%` }
      );
    }

    query.orderBy('order.createdAt', 'DESC');

    if (sort && sort.length) {
      sort.forEach((st: any) => {
        log(st.key)
        query.orderBy(`order.${st.key}`, st.value);
      });
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();

    return { data, total };
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.product.stockProduct']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
  }

  async receiptOrder(orderReceipt: ReceiptOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id: orderReceipt.orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID: ${orderReceipt.orderId} not found`);
    }

    const receiptOrder = new ReceiptOrder();
    receiptOrder.orderId = order.id;
    receiptOrder.orderItems = [];

    for (const item of orderReceipt.orderItems) {
      const orderItem = await this.orderItemRepository.findOne({ where: { id: item.orderItemId } });
      if (!orderItem) {
        throw new NotFoundException(`OrderItem with ID ${item.orderItemId} not found`);
      }

      const stockProduct = await this.stockProductRepository.findOne({ where: { product: { id: orderItem.product.id } } });
      if (!stockProduct) {
        throw new NotFoundException(`Product with ID ${item.orderItemId} not found in stock`);
      }

      stockProduct.quantity += item.qtToReceive;
      await this.stockProductRepository.save(stockProduct);

      const receiptOrderItem = new ReceiptOrderItem();
      receiptOrderItem.receivedQt = item.receivedQt;
      receiptOrderItem.requestedQt = item.requestedQt;
      receiptOrderItem.receiptOrder = receiptOrder;
      receiptOrderItem.status = item.requestedQt === item.receivedQt ? OrderReceiptStatus.COMPLET : OrderReceiptStatus.INCOMPLET;
      receiptOrder.orderItems.push(receiptOrderItem);
    }

    order.status = receiptOrder.orderItems.every(item => item.status === OrderReceiptStatus.COMPLET) ? OrderStatus.DELIVERED : OrderStatus.PROCESSING;

    await this.receiptRepository.save(receiptOrder);
    await this.orderRepository.save(order);
  }

  async orderBill(orderId: number): Promise<{ url: string, orderId: number, blob: Blob }> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with ID: ${orderId} not found`);
    }

    const buffer = await this.billService.generateBill(order);
    const filePath: string = `${order.reference}`;
    const url = await this.s3Service.uploadFilePDF(filePath, buffer);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    return { url, orderId, blob };
  }
}
