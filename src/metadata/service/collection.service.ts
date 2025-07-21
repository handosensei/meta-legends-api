import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Collection } from '@src/metadata/entity/collection.entity';

import { ADDED } from '@src/enum/metadata-dump';

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
    newCollection.status = ADDED;
    try {
      return await this.collectionRepository.save(newCollection);
    } catch (error) {
      console.log(error);
    }
  }

  async getCollectionByContract(contract: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOneBy({ contract });
    if (collection !== null) {
      throw new Error('Collection not found');
    }
    return collection;
  }

  async save(collections: Collection): Promise<Collection> {
    return await this.collectionRepository.save(collections);
  }
}
