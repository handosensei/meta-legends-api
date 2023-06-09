import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { OgPet } from '@src/eligibility/og-pet/og-pet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 63, unique: true })
  wallet: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isModo: boolean;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Column('datetime', { nullable: true })
  lastLogin!: string | null;

  @Column('datetime')
  createdAt: string;

  @OneToOne(() => OgPet, (ogPet) => ogPet.user)
  ogPet!: OgPet | null;
}
