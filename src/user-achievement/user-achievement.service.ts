import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserAchievement } from '@src/user-achievement/user-achievement.entity';
import { User } from '@src/user/user.entity';
import { UserService } from '@src/user/user.service';

@Injectable()
export class UserAchievementService {
  constructor(
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
  ) {}

  async getAchievements(user: User) {
    const userAchievements = await this.userAchievementRepository.find({
      relations: { achievement: true },
      where: {
        user: user,
      },
    });
    return userAchievements.map((userAchievement) => {
      return userAchievement.achievement;
    });
  }
}
