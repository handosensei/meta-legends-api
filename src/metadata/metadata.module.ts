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
  exports: [TypeOrmModule, MetadataService],
  controllers: [LandController],
  providers: [MetadataService],
})
export class MetadataModule {}
