import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('sales_packaging')
export class SalesPackaging {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unit: string;

  @Column()
  quantity: number;

  @Column()
  purchasePrice: number;

  @Column()
  sellPrice: number;

  @ManyToOne(() => Product, (product) => product.salesPackagings)
  @JoinColumn({name: 'product_id'})
  product: Product;

}
