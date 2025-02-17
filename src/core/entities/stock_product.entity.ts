import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Stock } from './stock.entity';
  import { Product } from './product.entity';
  import { User } from './user.entity';
  
  @Entity()
  export class StockProduct {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'int' })
    quantity: number; // Additional field: Quantity of the product in the stock
  
    @ManyToOne(() => User, (user) => user.stockProducts)
    @JoinColumn({ name: 'author_id' })
    author?: User | null; // Additional field: User who added the product to the stock
  
    @ManyToOne(() => Stock, (stock) => stock.stockProducts)
    @JoinColumn({ name: 'stock_id' })
    stock: Stock;
  
    @ManyToOne(() => Product, (product) => product.stockProducts)
    @JoinColumn({ name: 'product_id' })
    product: Product;
  }