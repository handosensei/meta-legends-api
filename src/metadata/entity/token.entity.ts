import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';
import { TokenAttribute } from './token-attribute.entity';
import { Rank } from './rank.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  collectionId: number;

  @Column('int', { nullable: false })
  token: number;

  @Column('varchar', { nullable: false, length: 255 })
  name: string;

  @Column('varchar', { nullable: false, length: 255 })
  image_url: string;

  @ManyToOne(() => Collection, (collection) => collection.tokens)
  collection: Collection;

  @OneToMany(() => TokenAttribute, (tokenAttribute) => tokenAttribute.token)
  tokenAttributes: TokenAttribute[];

  @OneToOne(() => Rank, (rank) => rank.token)
  rank: Rank;
}
