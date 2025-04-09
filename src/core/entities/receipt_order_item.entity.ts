import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ReceiptOrder } from './receipt_order.entity';
import { OrderReceiptStatus } from '../enums/order_receipt_status';


@Entity('order_items')
export class ReceiptOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  receivedQt: number;

  @Column({ type: 'int' })
  requestedQt: number;

  @Column({ type: 'int' })
  qtToReceive: number;

  @Column({
    type: 'enum',
    enum: OrderReceiptStatus,
  })
  status: OrderReceiptStatus;

  @ManyToOne(() => ReceiptOrder, (receiptOrder) => receiptOrder.orderItems)
  receiptOrder: ReceiptOrder;
}
