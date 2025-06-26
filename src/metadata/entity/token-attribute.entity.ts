import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attribute } from './attribute.entity';
import { Token } from './token.entity';

@Entity('token_attribute')
export class TokenAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, (attribute) => attribute.tokenAttributes)
  attribute: Attribute;

  @ManyToOne(() => Token, (token) => token.tokenAttributes)
  token: Token;
}
