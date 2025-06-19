import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TraitType } from '@src/metadata/entity/trait-type.entity';
import { Collection } from '@src/metadata/entity/collection.entity';

import fs = require('fs');
import path = require('path');

@Injectable()
export class TraitTypeService {
  private static readonly logger = new Logger(TraitTypeService.name);

  constructor(
    @InjectRepository(TraitType)
    private traitTypeRepository: Repository<TraitType>,
  ) {}

  async saveTraitTypes(collection: Collection, pathDirectory: string) {
    const files = fs.readdirSync(pathDirectory);
    const traitTypesToExtract = [];
    for (const file of files) {
      if (file == '.DS_Store') {
        continue;
      }
      const attributes = this.extractMetadataAttributes(pathDirectory, file);
      for (const attributeExtract of attributes) {
        if (!(attributeExtract['trait_type'] in traitTypesToExtract)) {
          const traitType = new TraitType();
          traitType.name = attributeExtract['trait_type'];
          traitType.collection = collection;
          traitTypesToExtract[attributeExtract['trait_type']] = traitType;
        }
      }
    }
    const keys = [...Object.keys(traitTypesToExtract)];
    const traitTypesToSave: TraitType[] = [];
    for (const key of keys) {
      traitTypesToSave.push(traitTypesToExtract[key]);
    }
    return await this.traitTypeRepository.save(traitTypesToSave);
  }

  extractMetadataAttributes(pathDirectory: string, file: string): string {
    const filePath = path.join(pathDirectory, file);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const metadata = JSON.parse(data);
      return metadata['attributes'];
    } catch (err) {
      console.error('Error reading or parsing file:', err);
      return null;
    }
  }
}
