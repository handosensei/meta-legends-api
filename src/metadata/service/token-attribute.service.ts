import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import fs = require('fs');

import { TokenAttribute } from '@src/metadata/entity/token-attribute.entity';
import { Attribute } from '../entity/attribute.entity';

@Injectable()
export class TokenAttributeService {
  private static readonly logger = new Logger(TokenAttributeService.name);

  constructor(
    @InjectRepository(TokenAttribute)
    private tokenAttributeRepository: Repository<TokenAttribute>,
  ) {}

  async saveTokenAttributes(attributes: Attribute[], pathDirectory: string) {

  }
}
