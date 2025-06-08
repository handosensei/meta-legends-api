import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attribute } from './attribute.entity';
import { Rank } from './rank.entity';
import { Token } from './token.entity';
import { TraitType } from './trait-type.entity';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, length: 255 })
  name: string;

  @Column('varchar', { nullable: false, length: 255 })
  blockchain: string;

  @Column('varchar', { nullable: false, length: 255 })
  status: string;

  @Column('int', { nullable: true })
  supply: number;

  @Column('varchar', { nullable: false, length: 255, unique: true })
  contract: string;

  @Column('varchar', { nullable: true, length: 255 })
  trait_file_extension: string;

  @OneToMany(() => Attribute, (attribute) => attribute.collection)
  attributes: Attribute[];

  @OneToMany(() => TraitType, (traitType) => traitType.collection)
  traitTypes: TraitType[];

  @OneToMany(() => Token, (token) => token.collection)
  tokens: Token[];

  @OneToMany(() => Rank, (rank) => rank.collection)
  ranks: Rank[];
}