import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TraitTypeService } from './trait-type.service';
import { AttributeService } from './attribute.service';
import { TokenService } from './token.service';

import { Collection } from '@src/metadata/entity/collection.entity';

import {
  ADDED,
  ATTRIBUTE_SAVED,
  ATTRIBUTE_BINDED,
  RANK_EXECUTED,
} from '@src/enum/metadata-dump';

@Injectable()
export class CollectionService {
  private static readonly logger = new Logger(CollectionService.name);

  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    private traitTypeService: TraitTypeService,
    private attributeService: AttributeService,
    private tokenService: TokenService,
  ) {}

  async getOneByContractOrCreate(
    contract: string,
    name: string,
    blockchain: string,
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findOneBy({ contract });
    if (collection !== null) {
      return collection;
    }
    const newCollection = new Collection();
    newCollection.contract = contract;
    newCollection.name = name;
    newCollection.blockchain = blockchain;
    newCollection.status = ADDED;
    try {
      return await this.collectionRepository.save(newCollection);
    } catch (error) {
      console.log(error);
    }
  }

  async processBindAttributes(collection: Collection): Promise<void> {}

  processRank(collection: Collection): void {}
}
