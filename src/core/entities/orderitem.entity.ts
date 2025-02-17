import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Order } from './order.entity';
  import { Product } from './product.entity';
  
  @Entity('order_items')
  export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'int' })
    quantity: number; // Quantity of the product in the order
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number; // Price of the product at the time of ordering
  
    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'order_id' })
    order: Order; // Order to which this item belongs
  
    @ManyToOne(() => Product, (product) => product.orderItems)
    @JoinColumn({ name: 'product_id' })
    product: Product; // Product in the order
  }