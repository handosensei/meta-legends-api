import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Token } from '../entity/token.entity';
import { Collection } from '../entity/collection.entity';

@Injectable()
export class TokenService {
  private static readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  buildToken(collection: Collection, metadata: any, file: string) {
    const token = new Token();
    token.collection = collection;
    token.number = this.defineTokenNumber(file);
    if ('name' in metadata) {
      token.name = metadata['name'];
    }
    if ('image_url' in metadata) {
      token.imageUrl = metadata['image_url'];
    }
    if ('animation_url' in metadata) {
      token.animationUrl = metadata['animation_url'];
    }
    return token;
  }

  defineTokenNumber(file: string) {
    // console.log(file);
    // const fileNameWithoutExtension = file.split('.').slice(0, -1).join('.');
    // console.log('fileNameWithoutExtension');
    // console.log(fileNameWithoutExtension);
    return Number(file);
  }
}
