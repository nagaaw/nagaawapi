import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { StockProduct } from './stock_product.entity';
import { Order } from './order.entity';
import { Payment } from './payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  linkedinId: string | null;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar' })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetTokenExpiry: Date | null;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'datetime', nullable: true })
  refreshTokenExpiry: Date | null;

  @OneToMany(() => Company, (company) => company.owner, {
    cascade: true,
    nullable: true,
  })
  companies: Company[] | null;

  @OneToMany(() => StockProduct, (stockProduct) => stockProduct.author)
  stockProducts: StockProduct[]; // Relationship with StockProduct

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
    nullable: true,
  })
  orders: Order[] | null;

  @OneToMany(() => Payment, (payment) => payment.user, {
    cascade: true,
    nullable: true,
  })
  payments: Payment[] | null;

 
}