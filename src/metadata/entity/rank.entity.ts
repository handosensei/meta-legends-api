import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Collection } from './collection.entity';
import { Token } from './token.entity';

@Entity()
export class Rank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  token_id: number;

  @Column('int', { nullable: true })
  collection_id: number;

  @Column('double', { nullable: true })
  hando_score: number;

  @Column('int', { nullable: true })
  hando_rank: number;

  @ManyToOne(() => Collection, (collection) => collection.ranks)
  collection: Collection;

  @OneToOne(() => Token)
  @JoinColumn({ name: 'token_id' })
  token: Token;
}