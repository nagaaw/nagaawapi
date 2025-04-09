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

  @Column({ type: 'varchar', length: 50 })
  unit: string; // Unit of measurement for the product (e.g., piece, kg)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number; // Discount applied to the product

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tva: number; // Tax (e.g., VAT) applied to the product

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total: number; // Total price for this order item (quantity * price - discount + tva)

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order; // Order to which this item belongs

  @ManyToOne(() => Product, (product) => product.orderItems, {eager: true})
  @JoinColumn({ name: 'product_id' })
  product: Product; // Product in the order
}
