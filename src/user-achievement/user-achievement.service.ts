import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserAchievement } from '@src/user-achievement/user-achievement.entity';
import { User } from '@src/user/user.entity';
import { UserService } from '@src/user/user.service';
import { Achievement } from '@src/achievement/achievement.entity';

// 📷 (3 to 5) Legend investor : Rough Armor
// 📷(6 to 10) Virtual conservative : Goldboi Weapon
// 📷(11 to 21) Legendary Holder : Cyber Pet
// 📷(21 to 50) Legend Museum : Goldboi Vehicle (The on in preview )
// 📷(51+) Legend Whale : Celestial Sniper

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

  defineHoldingRewardAchievements(
    user: User,
    achievementsSortByCode,
    nbNftHold,
  ) {
    const userAchievements = [];
    if (nbNftHold === 1) {
      const achievement = this.createUserAchievement(
        user,
        achievementsSortByCode['holder'],
      );
      userAchievements.push(achievement);
      return userAchievements;
    }

    let rest = nbNftHold;
    if (rest > 51) {
      const nbWhaleBadge = Math.floor(rest / 51);
      for (let i = 0; i < nbWhaleBadge; i++) {
        const achievement = this.createUserAchievement(
          user,
          achievementsSortByCode['legend-whale'],
        );
        userAchievements.push(achievement);
        rest -= 51;
      }
    }

    const badges = {
      'legend-museum': 20,
      'legendary-holder': 10,
      'virtual-conservative': 5,
      'legend-investor': 2,
    };

    Object.keys(badges).forEach((badgeLabel) => {
      if (rest > badges[badgeLabel]) {
        const achievement = this.createUserAchievement(
          user,
          achievementsSortByCode[badgeLabel],
        );
        userAchievements.push(achievement);
      }
    });

    // this.userAchievementRepository.save(userAchievements);
    return userAchievements;
  }

  createUserAchievement(user: User, achievement: Achievement): UserAchievement {
    const userAchievement = new UserAchievement();
    userAchievement.user = user;
    userAchievement.achievement = achievement;
    return userAchievement;
  }

  save(userAchievements: UserAchievement[]) {
    this.userAchievementRepository.save(userAchievements);
  }
}
