import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

import { UserService } from './user.service';
import { AlchemyService } from '@src/client/alchemy/alchemy.service';
import { UserController } from './user.controller';
import { UserAchievement } from '@src/user-achievement/user-achievement.entity';
import { UserAchievementService } from '@src/user-achievement/user-achievement.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAchievement])],
  exports: [TypeOrmModule],
  providers: [AlchemyService, UserService, UserAchievementService],
  controllers: [UserController],
})
export class UserModule {}
