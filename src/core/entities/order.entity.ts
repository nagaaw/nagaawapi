import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './orderitem.entity';
import { Payment } from './payment.entity';
import { OrderType } from '../enums/order_type.enum';
import { OrderStatus } from '../enums/order_status.enum';
import { Supplier } from './supplier.entity';
import { Client } from './client.enity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({ nullable: false, unique: true })
  reference: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  orderDate?: Date; // Date and time when the order was placed

  @Column({ type: 'timestamp', nullable: true })
  receiptDate?: Date; // Date and time when the order was received

  @ManyToOne(() => Supplier, supplier => supplier.orders, { eager: true })
  supplier: Supplier;

  @ManyToOne(() => Client, client => client.orders, { eager: true })
  client: Client;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[]; // Items in the order

  @Column()
  totalAmount?: number;

  @OneToOne(() => Payment, payment => payment.order, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  payment: Payment | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
