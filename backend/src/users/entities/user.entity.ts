import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Unique(['githubId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  githubId!: string;

  @Column()
  username!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  email?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
