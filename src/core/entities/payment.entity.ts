import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Order } from './order.entity';
  
  @Entity('payments')
  export class Payment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 50 })
    paymentMethod: string; // e.g., 'orange_money', 'wave', 'free_money', 'stripe'
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number; // Amount paid
  
    @Column({ type: 'varchar', length: 50, default: 'pending' })
    status: string; // Payment status (e.g., pending, completed, failed)
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    transactionId: string; // Transaction ID from the payment gateway
  
    @ManyToOne(() => User, (user) => user.payments)
    @JoinColumn({ name: 'user_id' })
    user: User; // User who made the payment
  
    @ManyToOne(() => Order, (order) => order.payments)
    @JoinColumn({ name: 'order_id' })
    order: Order; // Order associated with the payment
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  }