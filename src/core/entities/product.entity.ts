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
  OneToOne
} from 'typeorm';
import { Company } from './company.entity';
import { StockProduct } from './stock_product.entity';
import { Category } from './category.entity';
import { OrderItem } from './orderitem.entity';
import { SalesPackaging } from './sales_packaging.entity';
import { Supplier } from './supplier.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storable: boolean;

  @Column({ length: 100 })
  reference: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  codeBarre: string;

  @Column({ length: 50 })
  storageUnit: string;

  @Column('double', { nullable: true })
  cump: number;

  @Column('double', { nullable: true })
  criticalStorage: number;

  @Column('simple-array')
  imgUrls: string[];

  @Column('boolean', {default: true})
  active: boolean = true;

  @ManyToMany(() => Supplier, (supplier) => supplier.products)
  @JoinTable({
    name: 'product_suppliers',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'supplier_id', referencedColumnName: 'id' },
  })
  suppliers: Supplier[];

  @OneToMany(() => SalesPackaging, (salesPackaging) => salesPackaging.product, { eager: true })
  salesPackagings: SalesPackaging[];

  @OneToOne(() => StockProduct, (stockProduct) => stockProduct.product)
  stockProduct?: StockProduct;

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
