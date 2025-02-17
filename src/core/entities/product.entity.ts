import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Company } from './company.entity';
import { StockProduct } from './stock_product.entity';
import { Category } from './category.entity';
import { OrderItem } from './orderitem.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  label: string;

  @Column('text')
  description: string;

  @Column('double')
  price: number;

  @Column('simple-array')
  imgUrls: string[];

  @OneToMany(() => StockProduct, (stockProduct) => stockProduct.product)
  stockProducts: StockProduct[]; // Relationship with StockProduct

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToMany(() => Category, (category) => category.products) // Define the inverse side
  @JoinTable() // JoinTable is required on one side of the ManyToMany relationship
  categories?: Category[]; // Relationship with Category

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[]; // Relationship with StockProduct


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}