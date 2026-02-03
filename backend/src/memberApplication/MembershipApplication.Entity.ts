import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('membership_applications')
export class MembershipApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('simple-array') 
  documents: string[];

  @Column({ default: 'pending' }) 
  status: 'pending' | 'approved' | 'rejected' | 'info-required';

  @Column({ nullable: true }) 
  oneTimePassword?: string;

  @Column({ nullable: true })
  rejectionReason?: string;
  
  @Column({ unique: true })
  applicationCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  adminComment: string;
  
}
