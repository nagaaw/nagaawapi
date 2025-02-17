import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Stock } from './stock.entity';
import { Category } from './category.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  sector: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Product, (product) => product.company, {
    cascade: true,
    nullable: true,
  })
  products: Product[] | null;

  @OneToMany(() => Stock, (stock) => stock.company) // One-to-Many relationship with Stock
  stocks: Stock[];

  @OneToMany(() => Category, (category) => category.company) // One-to-Many relationship with Stock
  categories: Category[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}