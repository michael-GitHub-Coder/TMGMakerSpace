import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity'; // Your existing user entity

@Entity('Bookings')
export class BookingEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column()
  machineType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerHour: number;

  @Column()
  bookingDate: string;

  @Column()
  bookingTime: string;

  @Column()
  duration: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  status: 'pending' | 'confirmed' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
