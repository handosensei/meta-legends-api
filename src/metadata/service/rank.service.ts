import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AttributeService } from '@src/metadata/service/attribute.service';
import { TokenService } from './token.service';

import { Collection } from '../entity/collection.entity';
import { Rank } from '../entity/rank.entity';
import { Token } from '../entity/token.entity';

@Injectable()
export class RankService {
  private static readonly logger = new Logger(RankService.name);

  constructor(
    @InjectRepository(Rank)
    private rankRepository: Repository<Rank>,
    private attributeService: AttributeService,
    private tokenService: TokenService,
  ) {}

  async process(collection: Collection) {
    RankService.logger.log(`Processing rank for collection ${collection.name}`);
    const attributes = await this.attributeService.findAll(collection);
    const points = {};
    for (const attribute of attributes) {
      points[attribute.id] = 1 / attribute.percent;
    }
    const tokens: Token[] = await this.tokenService.findAll();
    const tokenScore = {};
    for (const token of tokens) {
      let scoreToken = 0;
      for (const tokenAttribute of token.tokenAttributes) {
        scoreToken += points[tokenAttribute.attribute.id];
      }
      tokenScore[token.id] = { score: scoreToken, rank: 0 };
    }
    this.defineRankTokens(tokenScore);
    return tokenScore;
  }

  defineRankTokens(tokenScore: any) {
    return tokenScore;
  }
}
