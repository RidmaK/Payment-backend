import { User } from './user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { PaymentMethod, PaymentType, Status } from '../types/payment.types';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinTable()
  user: User;

  @Column()
  payment_id: string;

  @Column({ nullable: true })
  invoice_id: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentType })
  payment_type: PaymentType;

  @Column({ default: true })
  isRenewal: boolean;

  @Column()
  expire_date: string;

  @Column()
  create_date: string;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;
}
