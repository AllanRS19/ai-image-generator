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
  SQUARE = '1024x1024',
  LANDSCAPE_9_7 = '1152x896',
  PORTRAIT_7_9 = '896x1152',
  LANDSCAPE_7_4 = '1344x768',
  PORTRAIT_4_7 = '768x1344',
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
    default: ImageResolution.SQUARE,
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
