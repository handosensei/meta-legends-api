import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import path = require('path');
import * as fs from 'fs/promises';

import { AttributeService } from './attribute.service';
import { TokenService } from './token.service';

import { TokenAttribute } from '../entity/token-attribute.entity';
import { Collection } from '../entity/collection.entity';
import { Token } from '../entity/token.entity';

@Injectable()
export class TokenAttributeService {
  private static readonly logger = new Logger(TokenAttributeService.name);

  constructor(
    @InjectRepository(TokenAttribute)
    private tokenAttributeRepository: Repository<TokenAttribute>,
    private attributeService: AttributeService,
    private tokenService: TokenService,
  ) {}

  async save(tokenAttributes: TokenAttribute[]): Promise<void> {
    const batchSize = 200;
    for (let i = 0; i < tokenAttributes.length; i += batchSize) {
      const chunk = tokenAttributes.slice(i, i + batchSize);
      await this.tokenAttributeRepository.save(chunk);
    }
  }

  async bindTokenAttributes(
    collection: Collection,
  ): Promise<{ tokens: Token[]; tokenAttributes: TokenAttribute[] }> {
    const tokenAttributesToSave: TokenAttribute[] = [];
    const tokensToSave: Token[] = [];

    const attributes = await this.attributeService.findAll(collection);
    const attributesSorted = this.attributeService.sortAttributes(attributes);

    const pathDirectory = path.join(
      process.cwd(),
      `data/metadata/${collection.blockchain}/${collection.contract}/`,
    );
    const files = await fs.readdir(pathDirectory);
    for (const file of files) {
      if (file === '.DS_Store') {
        continue;
      }
      const data = await fs.readFile(`${pathDirectory}${file}`, 'utf-8');
      const metadata = JSON.parse(data);
      const token = this.tokenService.buildToken(collection, metadata, file);
      tokensToSave.push(token);
      for (const attribute of metadata.attributes) {
        const tokenAttribute = new TokenAttribute();
        tokenAttribute.token = token;
        const newAttribute =
          attributesSorted[attribute.trait_type][attribute.value];
        tokenAttribute.attribute = newAttribute;
        tokenAttributesToSave.push(tokenAttribute);
      }
    }
    return { tokens: tokensToSave, tokenAttributes: tokenAttributesToSave };
  }
}
