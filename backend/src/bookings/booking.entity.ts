import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bookings')
export class BookingEntity {
  @PrimaryColumn()
  id: string;

  // @Column()
  // userId: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  // Machine & pricing
  @Column()
  machineType: string;

  @Column('decimal')
  pricePerHour: number;

  // Booking timing
  @Column()
  bookingDate: string;

  @Column()
  bookingTime: string;

  @Column()
  duration: number;

  @Column('decimal')
  totalPrice: number;

  // Status
  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


export interface Booking {
  id: string;
  role: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  machineType: string;
  pricePerHour: number;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
