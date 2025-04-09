import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('suplliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  email: string;

  @Column()
  adresse: string;

  @Column({unique: true, nullable: false})
  reference: string;

  @ManyToMany(() => Product, (product) => product.suppliers)
  products: Product[];

  @OneToMany(() => Order, order => order.supplier)
  orders: Order[];

   @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
