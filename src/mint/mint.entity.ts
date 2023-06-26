import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@src/user/user.entity';
import { Asset } from '@src/asset/asset.entity';
import { MintMonitoring } from '@src/mint-monitoring/mint-monitoring.entity';

@Entity()
export class Mint {
  @PrimaryGeneratedColumn()
  id!: number | null;

  @Column('varchar', { length: 123, unique: true })
  transaction: string;

  @Column({ type: 'int', nullable: true })
  token: number;

  @ManyToOne(() => Asset, (asset) => asset.mints)
  asset: Asset;

  @ManyToOne(() => User, (user) => user.mints)
  user: User;

  @ManyToOne(() => MintMonitoring, (mintMonitoring) => mintMonitoring.mints)
  mintMonitoring: MintMonitoring;

  @Column('datetime', { nullable: true })
  mintedAt!: string | null;
}