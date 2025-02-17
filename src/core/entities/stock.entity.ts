import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockProduct } from './stock_product.entity';
import { Company } from './company.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false, unique: true })
  idNumber: number;

  @Column({ type: 'varchar', nullable: false })
  label: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  localisation?: string;

  @OneToMany(() => StockProduct, (stockProduct) => stockProduct.stock)
  stockProducts?: StockProduct[]; // Relationship with StockProduct

  @ManyToOne(() => Company, (company) => company.stocks) // Many-to-One relationship with Company
  @JoinColumn({ name: 'company_id' }) // Foreign key column
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}