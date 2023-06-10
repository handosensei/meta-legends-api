import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MintOrder } from '@src/mint-order/mint-order.entity';
import { Asset } from '@src/asset/asset.entity';

@Entity()
export class MintMonitoring {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 123 })
  name: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  minted: number;

  @Column({ type: 'int', nullable: true })
  supply: number;

  @Column('decimal', { precision: 4, scale: 2 })
  rarity: number;

  @OneToMany(() => MintOrder, (mintOrder) => mintOrder.mintMonitoring)
  mintOrders: MintOrder[];

  @ManyToOne(() => Asset, (asset) => asset.mintOrders)
  asset: Asset;
}
