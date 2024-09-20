import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from './currency.entity';

@Entity()
export class Conversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(() => Currency, (currency) => currency.conversions)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
