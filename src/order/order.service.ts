import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../core/entities/order.entity';
import { User } from '../core/entities/user.entity';
import { Product } from '../core/entities/product.entity';
import { OrderItem } from '../core/entities/orderitem.entity';
import { CreateOrderDto, UpdateOrderDto } from './tdos/order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;

    // Find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Create the order
    const order = this.orderRepository.create({ user, status: 'pending' });

    // Calculate total amount and create order items
    let totalAmount = 0;
    order.items = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found.`);
        }

        const orderItem = this.orderItemRepository.create({
          product,
          quantity: item.quantity,
          price: product.price,
        });

        totalAmount += product.price * item.quantity;
        return orderItem;
      }),
    );

    order.totalAmount = totalAmount;
    order.orderNumber = uuidv4()
    return this.orderRepository.save(order);
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }

  async updateOrderStatus(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    order.status = updateOrderDto.status || order.status;
    return this.orderRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
  }
}