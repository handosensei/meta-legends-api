import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import fs = require('fs');
import path = require('path');

import { TraitTypeService } from './trait-type.service';
import { AttributeService } from './attribute.service';
import { TokenService } from './token.service';

import { Collection } from '@src/metadata/entity/collection.entity';
import { TraitType } from '@src/metadata/entity/trait-type.entity';

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

  getPathDirectory(collection: Collection): string {
    return `data/metadata/${collection.blockchain}/${collection.contract}/`;
  }

  async processSaveAttributes(collection: Collection): Promise<void> {
    CollectionService.logger.log(
      '[CollectionService] STEP 1 : Process token attributes binding',
    );
    const pathDirectory = this.getPathDirectory(collection);
    try {
      const traitTypes = await this.traitTypeService.saveTraitTypes(
        collection,
        pathDirectory,
      );
      await this.attributeService.saveAttributes(
        collection,
        traitTypes,
        pathDirectory,
      );
    } catch (error) {
      CollectionService.logger.error(
        '[CollectionService] STEP 1 - Fail : Save trait type and attributes failed',
      );
    }
  }

  async processBindAttributes(collection: Collection): Promise<void> {
    const attributes = await this.attributeService.findAll(collection);
    const attributesDict = this.attributeService.sortAttributes(attributes);
    const pathDirectory = this.getPathDirectory(collection);
    const tokens = this.tokenService.createToken(collection, pathDirectory);
    
  }

  processRank(collection: Collection): void {}
}
