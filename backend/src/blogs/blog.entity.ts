import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blogs')
export class BlogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 255, nullable: true })
  author: string;

  @Column({ length: 500, nullable: true })
  summary: string;

  @Column({ length: 255, nullable: true })
  imageUrl: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ default: true })
  published: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
