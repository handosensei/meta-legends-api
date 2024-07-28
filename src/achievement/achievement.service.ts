import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from '@src/achievement/achievement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async getAllByCategory(category: string) {
    return await this.achievementRepository.findBy({ category });
  }

  orderByCode(achievements: Achievement[]) {
    const result = {};
    achievements.forEach((achievement) => {
      result[achievement.code] = achievement;
    });
    return result;
  }
}
