import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@src/user/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 63, unique: true })
  address: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Column('boolean', { default: false })
  isPrimary: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('datetime')
  createdAt: string;
}
