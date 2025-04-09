import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('clients')
export class Client {
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

  @Column({default: true})
  active: boolean;

  @OneToMany(() => Order, order => order.supplier)
  orders: Order[];
}
