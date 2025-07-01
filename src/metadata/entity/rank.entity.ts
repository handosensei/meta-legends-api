import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { Collection } from './collection.entity';
import { Token } from './token.entity';

@Entity()
export class Rank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double', { nullable: true })
  score: number;

  @Column('int', { nullable: true })
  rank: number;

  @ManyToOne(() => Collection, (collection) => collection.ranks)
  collection: Collection;

  @OneToOne(() => Token)
  @JoinColumn()
  token: Token;
}
