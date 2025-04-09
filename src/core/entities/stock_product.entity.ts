import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { Stock } from './stock.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class StockProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number; // Quantity of the product in the stock

  @Column({ type: 'varchar' })
  unit?: string; // Unit of the product in the stock

  @ManyToOne(() => User, (user) => user.stockProducts)
  @JoinColumn({ name: 'author_id' })
  author?: User | null; // User who added the product to the stock

  @ManyToOne(() => Stock, (stock) => stock.stockProducts)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @OneToOne(() => Product, (product) => product.stockProduct, {eager: true})
  @JoinColumn({ name: 'product_id' }) 
  product: Product;
}
