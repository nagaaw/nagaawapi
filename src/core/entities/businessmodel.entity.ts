import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BusinessModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'text' })
  valueProposition: string;

  @Column({ type: 'simple-array' })
  customerSegments: string[];

  @Column({ type: 'simple-array' })
  channels: string[];

  @Column({ type: 'simple-array' })
  customerRelationships: string[];

  @Column({ type: 'simple-array' })
  revenueStreams: string[];

  @Column({ type: 'simple-array' })
  keyResources: string[];

  @Column({ type: 'simple-array' })
  keyActivities: string[];

  @Column({ type: 'simple-array' })
  keyPartnerships: string[];

  @Column({ type: 'simple-array' })
  costStructure: string[];

  @Column({ type: 'int' })
  projectId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  
}