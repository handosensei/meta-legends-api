import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TraitType } from '@src/metadata/entity/trait-type.entity';
import { Collection } from '@src/metadata/entity/collection.entity';

import * as fs from 'fs/promises';
import path = require('path');

@Injectable()
export class TraitTypeService {
  private static readonly logger = new Logger(TraitTypeService.name);

  constructor(
    @InjectRepository(TraitType)
    private traitTypeRepository: Repository<TraitType>,
  ) {}

  async saveTraitTypes(
    collection: Collection,
    pathDirectory: string,
  ): Promise<TraitType[]> {
    try {
      TraitTypeService.logger.debug(
        `Repository is connected: ${this.traitTypeRepository.manager.connection.isConnected}`,
      );
      TraitTypeService.logger.log(
        `Saving trait types from directory: ${pathDirectory}`,
      );
      const files = await fs.readdir(pathDirectory);
      TraitTypeService.logger.debug(`Found ${files.length} files`);

      const traitTypesMap: Record<string, TraitType> = {};
      const traitTypesToSave: TraitType[] = [];

      for (const file of files) {
        if (file === '.DS_Store') {
          continue;
        }

        const attributes = await this.extractMetadataAttributes(
          pathDirectory,
          file,
        );
        if (!attributes) {
          continue;
        }

        for (const attributeExtract of attributes) {
          const traitTypeName = attributeExtract['trait_type'];
          if (!traitTypeName) {
            continue;
          }

          if (!traitTypesMap[traitTypeName]) {
            const traitType = new TraitType();
            traitType.name = traitTypeName;
            traitType.collection = collection;
            traitTypesMap[traitTypeName] = traitType;
            traitTypesToSave.push(traitType);
          }
        }
      }
      // return traitTypesToSave;
      if (traitTypesToSave.length > 0) {
        TraitTypeService.logger.log(
          `Saving ${traitTypesToSave.length} trait types`,
        );
        return await this.traitTypeRepository.save(traitTypesToSave);
      } else {
        TraitTypeService.logger.log('No trait types to save');
        return [];
      }
    } catch (error) {
      TraitTypeService.logger.error(
        `Error handle trait types: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async save(traitTypes: TraitType[]) {
    return await this.traitTypeRepository.save(traitTypes);
  }

  async extractMetadataAttributes(
    pathDirectory: string,
    file: string,
  ): Promise<any[]> {
    const filePath = path.join(pathDirectory, file);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const metadata = JSON.parse(data);
      return metadata['attributes'] || [];
    } catch (err) {
      TraitTypeService.logger.error(`Error reading or parsing file ${file}: ${err.message}`, err.stack);
      return null;
    }
  }
}
