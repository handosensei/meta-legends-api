import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Token } from '../entity/token.entity';
import { Collection } from '../entity/collection.entity';

import fs = require('fs');
import { TraitTypeService } from './trait-type.service';

@Injectable()
export class TokenService {
  private static readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private traitTypeService: TraitTypeService,
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

  async saveTokens(tokens: Token[]): Promise<Token[]> {
    return await this.tokenRepository.save(tokens);
  }

  async createToken(
    collection: Collection,
    pathDirectory: string,
  ): Promise<any[]> {
    const files = fs.readdirSync(pathDirectory);
    const tokens = [];
    const tokensSaved = [];
    for (const file of files) {
      if (file == '.DS_Store') {
        continue;
      }
      const metadata = this.traitTypeService.extractMetadataAttributes(
        pathDirectory,
        file,
      );
      const token = this.buildToken(collection, metadata, file);
      tokens.push(token);
      tokensSaved.push(token);
      if (tokens.length % 1000 === 0) {
        await this.tokenRepository.save(tokens);
        tokens.length = 0;
      }
    }
    await this.tokenRepository.save(tokens);
    return tokensSaved;
  }
}
