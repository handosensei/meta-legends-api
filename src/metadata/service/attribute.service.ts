import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import fs = require('fs');

import { TraitTypeService } from '@src/metadata/service/trait-type.service';
import { Attribute } from '../entity/attribute.entity';
import { Collection } from '../entity/collection.entity';
import { TraitType } from '../entity/trait-type.entity';

@Injectable()
export class AttributeService {
  private static readonly logger = new Logger(AttributeService.name);

  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    private traitTypeService: TraitTypeService,
  ) {}

  // async saveAttributes(
  //   collection: Collection,
  //   traitTypes: TraitType[],
  //   pathDirectory: string,
  // ): Promise<void> {
  //   const files = fs.readdirSync(pathDirectory);
  //   const attributesToSave: Attribute[] = [];
  //   const attributesSaved: any[] = [];
  //   for (const file of files) {
  //     if (file == '.DS_Store') {
  //       continue;
  //     }
  //     const attributes = this.traitTypeService.extractMetadataAttributes(
  //       pathDirectory,
  //       file,
  //     );
  //     const traitTypesDict = this.sortByName(traitTypes);
  //     for (const attributeExtract of attributes) {
  //       if (!(attributeExtract['trait_type'] in attributesSaved)) {
  //         attributesSaved[attributeExtract['trait_type']] = [];
  //       }
  //       if (
  //         attributesSaved[attributeExtract['trait_type']].includes(
  //           attributeExtract['value'],
  //         )
  //       ) {
  //         continue;
  //       }
  //       const attribute = new Attribute();
  //       attribute.value = attributeExtract['value'];
  //       attribute.collection = collection;
  //       attribute.traitType = traitTypesDict[attributeExtract['trait_type']];
  //       attributesToSave.push(attribute);
  //       attributesSaved[attributeExtract['trait_type']].push(
  //         attributeExtract['value'],
  //       );
  //     }
  //     if (attributesToSave.length % 1000 === 0) {
  //       await this.attributeRepository.save(attributesToSave);
  //       attributesToSave.length = 0;
  //     }
  //   }
  //   await this.attributeRepository.save(attributesToSave);
  // }

  async findAll(collection: Collection): Promise<Attribute[]> {
    return await this.attributeRepository.find({
      relations: { traitType: true },
      where: { collection },
    });
  }

  sortByName(traitTypes: TraitType[]) {
    const result = {};
    traitTypes.forEach((traitType) => {
      result[traitType.name] = traitType;
    });
    return result;
  }

  sortAttributes(attributes: Attribute[]) {
    const attributesSorted = {};
    for (const attribute of attributes) {
      if (attribute.traitType.name in attributesSorted) {
        const attributesFromTraitType =
          attributesSorted[attribute.traitType.name];
        if (attribute.value in attributesFromTraitType) {
          continue;
        }
      } else {
        attributesSorted[attribute.traitType.name] = {};
      }
      attributesSorted[attribute.traitType.name][attribute.value] = attribute;
    }
    return attributesSorted;
  }
}
