import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from './user.entity';
import { OrderItem } from './orderitem.entity';
import { Payment } from './payment.entity';
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 50, unique: true })
    orderNumber: string; // Unique order number
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number; // Total amount of the order
  
    @Column({ type: 'varchar', length: 50, default: 'pending' })
    status: string; // Order status (e.g., pending, completed, cancelled)
  
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User; // User who placed the order
  
    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
      cascade: true,
    })
    items: OrderItem[]; // Items in the order

    @OneToMany(() => Payment, (payment) => payment.user, {
        cascade: true,
        nullable: true,
      })
      payments: Payment[] | null;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  }