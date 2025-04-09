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
import { Payment } from './payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  linkedinId?: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  email: string;

  @Column({ type: 'varchar', unique: true, length: 20 })
  phone: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', default: false })
  active: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  resetToken?: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetTokenExpiry?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string | null;

  @Column({ type: 'datetime', nullable: true })
  refreshTokenExpiry?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  otp?: string | null; // One-time password for verification

  @Column({ type: 'datetime', nullable: true })
  otpExpiry?: Date | null; // Expiration date for OTP

  @OneToMany(() => Company, (company) => company.owner, { cascade: true })
  companies?: Company[];

  @OneToMany(() => StockProduct, (stockProduct) => stockProduct.author)
  stockProducts: StockProduct[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments?: Payment[];
}
