import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from './collection.entity';
import { Attribute } from './attribute.entity';

@Entity('trait_type')
export class TraitType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  collectionId: number;

  @Column('varchar', { nullable: false, length: 255 })
  name: string;

  @ManyToOne(() => Collection, (collection) => collection.traitTypes)
  collection: Collection;

  @OneToMany(() => Attribute, (attribute) => attribute.traitType)
  attributes: Attribute[];
}
