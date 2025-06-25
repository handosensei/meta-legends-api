import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attribute } from '../entity/attribute.entity';

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
}
