import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';
import { TraitType } from './trait-type.entity';
import { TokenAttribute } from './token-attribute.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  trait_type_id: number;

  @Column('int', { nullable: true })
  collection_id: number;

  @Column('varchar', { nullable: true, length: 255 })
  value: string;

  @Column('double', { nullable: true })
  percent: number;

  @ManyToOne(() => TraitType, (traitType) => traitType.attributes)
  traitType: TraitType;

  @ManyToOne(() => Collection, (collection) => collection.attributes)
  collection: Collection;

  @OneToMany(() => TokenAttribute, (tokenAttribute) => tokenAttribute.attribute)
  tokenAttributes: TokenAttribute[];
}