import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MintOrder } from '@src/mint/order/mint-order.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 123 })
  name: string;

  @Column('varchar', { length: 123 })
  code: string;

  @Column('varchar', { length: 63, nullable: true })
  contract!: string | null;

  @Column({ type: 'int', nullable: true })
  supply!: number | null;

  @Column({ default: false })
  isOpen: boolean;

  @Column({ type: 'datetime', nullable: true })
  openOn!: string | null;

  @OneToMany(() => MintOrder, (mintOrder) => mintOrder.asset)
  mintOrders: MintOrder[];
}
