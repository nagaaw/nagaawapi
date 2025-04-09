import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ReceiptOrderItem } from './receipt_order_item.entity';

@Entity('receipt_orders')
export class ReceiptOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orderId: number;

  @Column({type: 'varchar'})
  comment: string;

  @OneToMany(() =>ReceiptOrderItem, (orderItem) => orderItem.receiptOrder)
  orderItems: ReceiptOrderItem[];

}
