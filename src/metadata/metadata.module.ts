import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LandModule } from '@src/land/land.module';

import { MetadataService } from './metadata.service';

import { LandController } from './land/land.controller';
import { Collection } from './entity/collection.entity';
import { TraitType } from './entity/trait-type.entity';
import { Attribute } from './entity/attribute.entity';
import { Token } from './entity/token.entity';
import { TokenAttribute } from './entity/token-attribute.entity';

import { CollectionService } from './service/collection.service';
import { TraitTypeService } from './service/trait-type.service';
import { AttributeService } from './service/attribute.service';
import { TokenAttributeService } from './service/token-attribute.service';
import { TokenService } from './service/token.service';
import { RankService } from './service/rank.service';
import { MetadataController } from './metadata.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collection,
      TraitType,
      Attribute,
      Token,
      TokenAttribute,
    ]),
    LandModule,
  ],
  exports: [
    TypeOrmModule,
    MetadataService,
    CollectionService,
    TraitTypeService,
    AttributeService,
    TokenAttributeService,
    TokenService,
    RankService,
  ],
  controllers: [LandController, MetadataController],
  providers: [
    MetadataService,
    CollectionService,
    TraitTypeService,
    AttributeService,
    TokenAttributeService,
    TokenService,
    RankService,
  ],
})
export class MetadataModule {}
