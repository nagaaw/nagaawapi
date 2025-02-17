import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Company } from './company.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', nullable: false })
  label: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Product, (product) => product.categories) // Define the inverse side
  @JoinTable()
  products?: Product[];

  @ManyToOne(() => Company, (company) => company.categories) // Many-to-One relationship with Company
  @JoinColumn({ name: 'company_id' }) // Foreign key column
  company: Company;
}