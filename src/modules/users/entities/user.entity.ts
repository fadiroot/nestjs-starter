import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  password_hash: string;

  @Column({ length: 255, nullable: true })
  google_id: string;

  @Column({ type: 'uuid', nullable: true })
  role_id: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'text', nullable: true })
  profile_image: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email_verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verification_expires: Date;

  @Column({ type: 'varchar', length: 6, nullable: true })
  password_reset_code: string;

  @Column({ type: 'timestamp', nullable: true })
  password_reset_expires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

