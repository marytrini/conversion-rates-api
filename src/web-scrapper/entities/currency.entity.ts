import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversion } from './conversion.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  sufix: string;

  @OneToMany(() => Conversion, (conversion) => conversion.currency)
  conversions: Conversion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
