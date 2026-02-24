import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('keys')
export class KeyEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  equipmentName: string;

  @Column()
  memberName: string;

  @Column()
  bookingDateTime: string;

  @Column({ default: 'available' })
  keyStatus: 'available' | 'issued' | 'returned';

  @Column({ nullable: true })
  issuedBy?: string;

  @Column({ nullable: true })
  issuedDateTime?: string;

  @Column({ nullable: true })
  returnedDateTime?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface Key {
  id: string;
  equipmentName: string;
  memberName: string;
  bookingDateTime: string;
  keyStatus: 'available' | 'issued' | 'returned';
  issuedBy?: string;
  issuedDateTime?: string;
  returnedDateTime?: string;
  createdAt: Date;
  updatedAt: Date;
}
