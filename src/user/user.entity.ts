import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { OgPet } from '../eligibility/og-pet/og-pet.entity';
import { HoldingReward } from '../holding-reward/holding-reward.entity';
import { Exclude } from 'class-transformer';
import { Wallet } from '@src/wallet/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column('varchar', { length: 63, unique: true })
  wallet: string;

  @Column('varchar', { default: null })
  firstname!: string | null;

  @Column('varchar', { default: null })
  lastname!: string | null;

  @Column('varchar', { default: null })
  designation!: string | null;

  @Column('varchar', { unique: true, default: null })
  username!: string | null;

  @Column('varchar', { unique: true, default: null })
  email!: string | null;

  @Column('varchar', { default: null })
  bio!: string | null;

  @Column('varchar', { default: null })
  profilePicture!: string | null;

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isModo: boolean;

  @Exclude()
  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Exclude()
  @Column('datetime', { nullable: true })
  lastLogin!: string | null;

  @Column('varchar', { unique: true, default: null })
  linkedin!: string | null;

  @Column('varchar', { unique: true, default: null })
  twitter!: string | null;

  @Column('varchar', { unique: true, default: null })
  discord!: string | null;

  @Exclude()
  @Column('datetime')
  createdAt: string;

  @OneToOne(() => OgPet, (ogPet) => ogPet.user)
  ogPet!: OgPet | null;

  @OneToMany(() => HoldingReward, (holdingReward) => holdingReward.user)
  holdingRewards: HoldingReward[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}
