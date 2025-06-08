import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetadataService } from './metadata.service';
import { LandController } from './land/land.controller';
import { Collection } from './entity/collection.entity';
import { TraitType } from './entity/trait-type.entity';
import { Attribute } from './entity/attribute.entity';
import { Token } from './entity/token.entity';
import { Rank } from './entity/rank.entity';
import { TokenAttribute } from './entity/token-attribute.entity';
import { LandModule } from '@src/land/land.module';
import { CollectionService } from '@src/metadata/service/collection.service';
import { TraitTypeService } from './service/trait-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collection,
      TraitType,
      Attribute,
      Token,
      Rank,
      TokenAttribute,
    ]),
    LandModule,
  ],
  exports: [TypeOrmModule, MetadataService, CollectionService],
  controllers: [LandController],
  providers: [MetadataService, CollectionService, TraitTypeService],
})
export class MetadataModule {}
