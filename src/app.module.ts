import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthMiddleware } from './middleware/auth.middleware';

import { AppController } from './app.controller';
import { CollectionController } from './collection/collection.controller';
import { EligibilityController } from './eligibility/eligibility.controller';
import { MintPackageController } from './mint-package/mint-package.controller';
import { LandController as MetadataLandController } from './metadata/land/land.controller';
import { LandController } from '@src/land/land.controller';
import { LegendController } from './legend/legend.controller';
import { RewardController } from './reward/reward.controller';
import { UserController } from './user/user.controller';

import { AlchemyService } from './client/alchemy/alchemy.service';
import { AlchemyV3Service } from './client/alchemy-v3/alchemy-v3.service';
import { EtherscanService } from './client/etherscan/etherscan.service';

import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { CollectionsModule } from './collections/collections.module';
import { EligibilityModule } from './eligibility/eligibility.module';
import { HoldingRewardModule } from './holding-reward/holding-reward.module';
import { MintPackageModule } from './mint-package/mint-package.module';
import { LandModule } from './land/land.module';
import { MetadataModule } from './metadata/metadata.module';
import { RewardModule } from './reward/reward.module';
import { UtilsModule } from './utils/utils.module';
import { UserModule } from './user/user.module';

import { Achievement } from './achievement/achievement.entity';
import { Legend } from './legend/legend.entity';
import { HoldingReward } from '@src/holding-reward/holding-reward.entity';
import { MintPackage } from './mint-package/mint-package.entity';
import { OgPet } from './eligibility/og-pet/og-pet.entity';
import { Land } from './land/land.entity';
import { LandMinted } from '@src/land/land-minted/land-minted.entity';
import { Unstaked } from './reward/unstaked/unstaked.entity';
import { User } from './user/user.entity';
import { Collection } from './metadata/entity/collection.entity';
import { TraitType } from './metadata/entity/trait-type.entity';
import { Attribute } from './metadata/entity/attribute.entity';
import { Token } from './metadata/entity/token.entity';
import { Rank } from './metadata/entity/rank.entity';
import { TokenAttribute } from './metadata/entity/token-attribute.entity';

import { AchievementService as AchievementCommand } from './command/achievement/achievement.service';
import { TestService } from './command/test/test.service';
import { WhaleService } from './command/whale/whale.service';

import { AfkHolderService } from './command/afk-holder/afk-holder.service';
import { EligibilityVehicleService } from './command/eligibility-vehicle/eligibility-vehicle.service';
import { HoldingRewardService as HoldingRewardCommand } from './command/holding-reward/holding-reward.service';

import { AchievementService } from './achievement/achievement.service';
import { AppService } from './app.service';
import { BadgeRewardService } from './command/badge-reward/badge-reward.service';
import { BadgeService } from './reward/badge/badge.service';
import { CollectionService } from './collection/collection.service';
import { CouncilStoneService } from '@src/collections/council-stone/council-stone.service';
import { DatetimeService } from './utils/datetime/datetime.service';
import { EligibilityService } from '@src/eligibility/eligibility.service';
import { EligibilityResidenceService } from './command/eligibility-residence/eligibility-residence.service';
import { FileService } from './file/file.service';
import { HealingDroneService } from '@src/collections/healing-drone/healing-drone.service';
import { HoldingRewardService } from './holding-reward/holding-reward.service';
import { HolderController } from './holder/holder.controller';
import { HonoraryService } from '@src/collections/honorary/honorary.service';
import { HoldingRewardEndService } from './command/holding-reward-end/holding-reward-end.service';
import { LandService } from '@src/land/land.service';
import { LegendService } from './legend/legend.service';
import { MetadataService } from './metadata/metadata.service';
import { MintPackageService } from './mint-package/mint-package.service';
import { OgPetService } from './eligibility/og-pet/og-pet.service';
import { PerkOgPetService } from '@src/collections/perk-og-pet/perk-og-pet.service';
import { PerkArmorService } from '@src/collections/perk-armor/perk-armor.service';
import { PerkOgResidenceService } from '@src/collections/perk-og-residence/perk-og-residence.service';
import { RewardService } from './reward/reward.service';
import { ResidenceService } from './command/metadata/residence/residence.service';
import { TokenService } from './reward/token/token.service';
import { VehicleService } from '@src/collections/vehicle/vehicle.service';
import { UserAchievementService } from './user-achievement/user-achievement.service';
import { UserAchievement } from '@src/user-achievement/user-achievement.entity';
import { UnstakedService } from './reward/unstaked/unstaked.service';
import { UserService } from './user/user.service';
import { WeaponSkinService } from '@src/collections/weapon-skin/weapon-skin.service';
import {LandContent} from "@src/land/land-content/land-content.entity";
import { LandContentService } from './command/land-content/land-content.service';
import { DumpService } from '@src/command/metadata/dump/dump.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      max: 10000,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Achievement,
        HoldingReward,
        Legend,
        MintPackage,
        OgPet,
        Land,
        LandMinted,
        LandContent,
        Unstaked,
        User,
        UserAchievement,
        Collection,
        TraitType,
        Attribute,
        Token,
        Rank,
        TokenAttribute,
      ],
      synchronize: true,
    }),
    AuthModule,
    UtilsModule,
    MintPackageModule,
    RewardModule,
    ClientModule,
    EligibilityModule,
    UserModule,
    HoldingRewardModule,
    CollectionsModule,
    LandModule,
    MetadataModule,
  ],
  controllers: [
    AppController,
    EligibilityController,
    LegendController,
    MintPackageController,
    RewardController,
    UserController,
    HolderController,
    CollectionController,
    MetadataLandController,
    LandController,
  ],
  providers: [
    AfkHolderService,
    AlchemyService,
    AlchemyV3Service,
    AppService,
    AchievementService,
    AchievementCommand,
    BadgeRewardService,
    BadgeService,
    CouncilStoneService,
    DatetimeService,
    EligibilityService,
    EtherscanService,
    EligibilityVehicleService,
    EligibilityResidenceService,
    FileService,
    HonoraryService,
    HoldingRewardService,
    HoldingRewardCommand,
    HealingDroneService,
    LegendService,
    MintPackageService,
    MetadataService,
    OgPetService,
    LandService,
    PerkOgPetService,
    PerkArmorService,
    PerkOgResidenceService,
    RewardService,
    ResidenceService,
    TokenService,
    TestService,
    UnstakedService,
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    VehicleService,
    WhaleService,
    WeaponSkinService,
    HoldingRewardEndService,
    UserAchievementService,
    CollectionService,
    LandContentService,
    DumpService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes('');
  // }
}
