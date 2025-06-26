import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attribute } from '../entity/attribute.entity';
import { Collection } from '@src/metadata/entity/collection.entity';

@Injectable()
export class AttributeService {
  private static readonly logger = new Logger(AttributeService.name);

  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async save(attributes: Attribute[]) {
    return await this.attributeRepository.save(attributes);
  }

  async findAll(collection: Collection): Promise<Attribute[]> {
    return await this.attributeRepository.find({
      relations: { traitType: true },
      where: { collection },
    });
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
