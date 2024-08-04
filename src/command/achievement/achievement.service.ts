import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';

import { readFile } from 'fs';
import { UserService } from '@src/user/user.service';

import { AchievementService as AchievService } from '@src/achievement/achievement.service';
import { UserAchievementService } from '@src/user-achievement/user-achievement.service';

// npm run command-nest achievement-define
@Command({
  name: 'achievement-define',
  description: 'Define achievement by snapshot',
})
@Injectable()
export class AchievementService extends CommandRunner {
  private static readonly logger = new Logger(AchievementService.name);

  constructor(
    private userService: UserService,
    private achievService: AchievService,
    private userAchievementService: UserAchievementService,
  ) {
    super();
  }

  async run() {
    const allAchievements = await this.achievService.getAllByCategory(
      'badge-reward',
    );
    const achievements = this.achievService.orderByCode(allAchievements);
    readFile(
      __dirname + '/20240727131213_badge-rewards.csv',
      'utf-8',
      async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const rows = data.split('\n');
          for (const row of rows) {
            const data = row.split(',');
            const user = await this.userService.findOne(data[0]);
    //         const userAchievements =
    //           this.userAchievementService.defi neHoldingRewardAchievements(
    //             user,
    //             achievements,
    //             data[1],
    //           );
    //         // this.userAchievementService.save(userAchievements);
    //         console.log(userAchievements);
    //         return;
          }
        }
      },
    );
  }
}
