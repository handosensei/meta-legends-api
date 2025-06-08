import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';

import fs = require('fs');
import path = require('path');

import { AchievementService as AchievService } from '@src/achievement/achievement.service';
import { UserService } from '@src/user/user.service';
import { UserAchievementService } from '@src/user-achievement/user-achievement.service';
import { UserAchievement } from '@src/user-achievement/user-achievement.entity';
import { DataSource } from 'typeorm/data-source/DataSource';
// npm run command-nest achievement-define
@Command({
  name: 'achievement-define',
  description: 'Define achievement by snapshot',
})
@Injectable()
export class AchievementService extends CommandRunner {
  private static readonly logger = new Logger(AchievementService.name);

  constructor(
    private achievementService: AchievService,
    private userAchievementService: UserAchievementService,
    private userService: UserService,
    private dataSource: DataSource,
  ) {
    super();
  }

  async run() {
    const allAchievements = await this.achievementService.getAllByCategory(
      'badge-reward',
    );
    const achievements = this.achievementService.orderByCode(allAchievements);

    const rows = fs.readFileSync(
      path.resolve(__dirname + '/20240727131213_badge-rewards.csv'),
      'utf-8',
    );

    const wallets = [];
    const holders = {};
    rows.split('\n').forEach((line) => {
      const data = line.split(',');
      wallets.push(data[0]);
      holders[data[0]] = data[1];
    });

    for (const wallet of wallets) {
      const user = await this.userService.upsert(wallet);
      const userAchievements =
        this.userAchievementService.defineHoldingRewardAchievements(
          user,
          achievements,
          holders[wallet],
        );
      await this.dataSource
        .getRepository(UserAchievement)
        .save(userAchievements);
    }
  }
}
