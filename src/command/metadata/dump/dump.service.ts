import { Injectable, Logger } from '@nestjs/common';
import { CollectionService } from '@src/metadata/service/collection.service';
import { Command, CommandRunner } from 'nest-commander';

import * as fs from 'fs/promises';
import path = require('path');

import { AttributeService } from '@src/metadata/service/attribute.service';
import { TraitTypeService } from '@src/metadata/service/trait-type.service';
import { TokenAttributeService } from '@src/metadata/service/token-attribute.service';
import { TokenService } from '@src/metadata/service/token.service';

import { Collection } from '@src/metadata/entity/collection.entity';
import { TraitType } from '@src/metadata/entity/trait-type.entity';
import { Attribute } from '@src/metadata/entity/attribute.entity';

import {
  ADDED,
  ATTRIBUTE_SAVED,
  RANK_EXECUTED,
  ATTRIBUTE_BINDED,
} from '@src/enum/metadata-dump';

/*
npm run command-nest metadata-dump [contract] [name]
npm run command-nest metadata-dump 0xf9c362cdd6eeba080dd87845e88512aa0a18c615 "Meta-Legends"
 */
@Command({
  name: 'metadata-dump',
  description: 'Dump metadata in database',
})
@Injectable()
export class DumpService extends CommandRunner {
  private static readonly logger = new Logger(DumpService.name);

  constructor(
    private collectionService: CollectionService,
    private traitTypeService: TraitTypeService,
    private attributeService: AttributeService,
    private tokenAttributeService: TokenAttributeService,
    private tokenService: TokenService,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    DumpService.logger.log('[Command] DumpService');
    const contract = passedParam[0];
    const name = passedParam[1];
    const blockchain = passedParam[2] ?? 'ethereum';
    const collection = await this.collectionService.getOneByContractOrCreate(
      contract,
      name,
      blockchain,
    );
    try {
      // while (collection.status !== RANK_EXECUTED) {
      while (collection.status !== ATTRIBUTE_BINDED) {
        switch (collection.status) {
          case ADDED:
            // sauvegarde les traits et attributs de la colections
            DumpService.logger.log('[Command] DumpService : process ADDED');
            const metadataValues = await this.bindTraitTypeAndAttributes(
              collection,
            );
            await this.traitTypeService.save(metadataValues['traitTypes']);
            await this.attributeService.save(metadataValues['attributes']);
            collection.status = ATTRIBUTE_SAVED;
            break;
          case ATTRIBUTE_SAVED:
            DumpService.logger.log(
              '[Command] DumpService : process ATTRIBUTE_SAVED',
            );
            // création de lien entre les tokens et les attributs
            const { tokens, tokenAttributes } =
              await this.tokenAttributeService.bindTokenAttributes(collection);
            await this.tokenService.save(tokens);
            await this.tokenAttributeService.save(tokenAttributes);
            collection.status = ATTRIBUTE_BINDED;
            break;
          // case ATTRIBUTE_BINDED:
          //   // calcul du pourcentage et ranking
          //   this.collectionService.processRank(collection);
          //   collection.status = RANK_EXECUTED;
          //   break;
          // default:
          //   throw new RuntimeException(
          //     `Unknown status '${collection.status}' for contract '${collection.contract}'`,
          //   );
        }
      }
    } catch (error) {
      DumpService.logger.log(
        `Dump error - status ${collection.status} : ${error}`,
      );
    }
  }

  getPathDirectory(collection: Collection): string {
    return path.join(
      process.cwd(),
      `data/metadata/${collection.blockchain}/${collection.contract}/`,
    );
  }

  async extractMetadata(filepath) {
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * ADDED
   * @param collection
   */
  async bindTraitTypeAndAttributes(
    collection: Collection,
  ): Promise<{ traitTypes: TraitType[]; attributes: Attribute[] }> {
    const pathDirectory = this.getPathDirectory(collection);
    const files = await fs.readdir(pathDirectory);
    const traitTypesMap = {};
    const attributesMap = {};
    const traitTypesToSave: TraitType[] = [];
    const attributesToSave: Attribute[] = [];
    for (const file of files) {
      if (file === '.DS_Store') {
        continue;
      }
      const metadata = await this.extractMetadata(`${pathDirectory}${file}`);
      for (const attribute of metadata.attributes) {
        const traitTypeName = attribute['trait_type'];
        const attributeValue = attribute['value'];
        if (!(traitTypeName in traitTypesMap)) {
          const traitType = new TraitType();
          traitType.name = traitTypeName;
          traitType.collection = collection;
          traitTypesMap[traitTypeName] = traitType;
          traitTypesToSave.push(traitType);
        }
        if (
          traitTypeName in attributesMap &&
          attributesMap[traitTypeName].includes(attributeValue)
        ) {
          continue;
        }
        if (!(traitTypeName in attributesMap)) {
          attributesMap[traitTypeName] = [];
        }
        attributesMap[traitTypeName].push(attributeValue);
        const currentAttribute = new Attribute();
        currentAttribute.traitType = traitTypesMap[traitTypeName];
        currentAttribute.collection = collection;
        currentAttribute.value = attributeValue;
        attributesToSave.push(currentAttribute);
      }
    }
    return { traitTypes: traitTypesToSave, attributes: attributesToSave };
  }
}
