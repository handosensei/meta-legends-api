import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '@src/metadata/entity/collection.entity';
import { TraitType } from '@src/metadata/entity/trait-type.entity';
import { TraitTypeService } from '@src/metadata/service/trait-type.service';
import {
  ATTRIBUTE_PERCENT_PROCESSED,
  RANK_EXECUTED,
  TOKEN_ATTRIBUTE_SAVED,
  TRAIT_SAVED
} from '@src/enum/metadata-dump';
import fs = require('fs');
import path = require('path');

@Injectable()
export class CollectionService {

  private static readonly logger = new Logger(CollectionService.name);

  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
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
    newCollection.status = TRAIT_SAVED;
    try {
      return await this.collectionRepository.save(newCollection);
    } catch (error) {
      console.log(error);
    }
  }

  getPathDirectory(collection: Collection): string {
    return `data/metadata/${collection.blockchain}/${collection.contract}/`;
  }

  processTokenAttributesBinding(collection: Collection): void {
  }

  processAttributePercent(collection: Collection): void {
  }

  processRank(collection: Collection): void {
  }
}
