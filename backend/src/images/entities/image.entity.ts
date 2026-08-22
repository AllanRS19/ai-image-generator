import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ImageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ImageResolution {
  SQUARE_512 = '512x512',
  SQUARE_768 = '768x768',
  SQUARE_1024 = '1024x1024',
}

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column({ name: 'author_id' })
  authorId!: string;

  @Index()
  @Column({ type: 'text' })
  prompt!: string;

  @Column({ type: 'text', nullable: true })
  negativePrompt!: string | null;

  @Column({ type: 'varchar', nullable: true })
  color!: string | null;

  @Column({
    type: 'enum',
    enum: ImageResolution,
    default: ImageResolution.SQUARE_512,
  })
  resolution!: ImageResolution;

  @Column({ type: 'float', default: 7.5 })
  guidance!: number;

  @Column({ type: 'bigint' })
  seed!: string;

  @Column({ type: 'enum', enum: ImageStatus, default: ImageStatus.PENDING })
  status!: ImageStatus;

  @Column({ type: 'varchar', nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  failureReason!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
