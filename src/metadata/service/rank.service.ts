import { Injectable, Logger } from '@nestjs/common';

import { AttributeService } from '@src/metadata/service/attribute.service';
import { TokenService } from './token.service';

import { Collection } from '../entity/collection.entity';
import { Token } from '../entity/token.entity';

@Injectable()
export class RankService {
  private static readonly logger = new Logger(RankService.name);

  constructor(
    private attributeService: AttributeService,
    private tokenService: TokenService,
  ) {}

  async process(collection: Collection): Promise<Token[]> {
    RankService.logger.log(`Processing rank for collection ${collection.name}`);
    const attributes = await this.attributeService.findAll(collection);
    const points = {};
    for (const attribute of attributes) {
      points[attribute.id] = 1 / attribute.percent;
    }
    const tokens: Token[] = await this.tokenService.findAll();
    const tokensScored: Token[] = [];
    for (const token of tokens) {
      let scoreToken = 0;
      for (const tokenAttribute of token.tokenAttributes) {
        let weight = 1;
        if (tokenAttribute.attribute.traitType.weigth !== null) {
          weight = tokenAttribute.attribute.traitType.weigth;
        }
        scoreToken += points[tokenAttribute.attribute.id] * weight;
      }
      token.score = Number(scoreToken.toFixed(3));
      tokensScored.push(token);
    }
    return tokensScored;
  }

  async defineRank(): Promise<Token[]> {
    const tokens: Token[] = await this.tokenService.findAll();
    RankService.logger.log(`Sort tokens by score for collection`);
    // Sort tokens by score in descending order (highest score first)
    const tokensSorted = tokens.sort((a, b) => b.score - a.score);

    // Assign ranks sequentially (1, 2, 3, etc.) based on the sorted order
    // Lower rank means higher score
    for (let i = 0; i < tokensSorted.length; i++) {
      tokensSorted[i].rank = i + 1;
    }

    return tokensSorted;
  }
}
