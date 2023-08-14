import { Injectable } from '@nestjs/common';
import { Legend } from '../legend/legend.entity';
import * as moment from 'moment';
import { User } from '../user/user.entity';
import {
  HOLDING_REWARDS,
  HOLDING_REWARDS_KEY_VALUE,
} from '../enum/holding-reward';
import { HoldingReward } from '@src/holding-reward/holding-reward.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HoldingRewardService {
  constructor(
    @InjectRepository(HoldingReward)
    private holdingRewardRepository: Repository<HoldingReward>,
  ) {}

  isEligible(legend: Legend, duration: number): boolean {
    const now = moment();
    const purchasedOn = moment(legend.purchasedOn);

    return now.diff(purchasedOn, 'months') >= duration;
  }

  async findByUserAndHoldingRewardCode(
    user: User,
    rewardCode: string,
  ): Promise<HoldingReward[] | null> {
    return await this.holdingRewardRepository.findBy({
      user,
      rewardCode,
    });
  }

  async findByUser(user: User): Promise<object> {
    const holdingRewards = await this.holdingRewardRepository.findBy({
      user,
    });
    const result = {};
    for (const data of HOLDING_REWARDS) {
      const holdingRewardData = [];
      holdingRewards.forEach((holdingReward) => {
        if (holdingReward.rewardCode === data.code) {
          holdingRewardData.push(holdingReward);
        }
      });
      result[data.code] = holdingRewardData;
    }
    return result;
  }

  async getTokenIdsSavedByCode(user: User, rewardCode: string) {
    const holdingRewards = await this.findByUserAndHoldingRewardCode(
      user,
      rewardCode,
    );

    const tokenIds = [];
    holdingRewards.map((holdingReward) => {
      tokenIds.push(holdingReward.tokenId);
    });

    return tokenIds;
  }

  async buildNewHoldingRewards(
    user: User,
    legends: Legend[],
    holdingRewardCode: string,
  ): Promise<HoldingReward[] | null> {
    const tokenIds = await this.getTokenIdsSavedByCode(user, holdingRewardCode);
    const hRewardSelected = HOLDING_REWARDS_KEY_VALUE[holdingRewardCode];
    const holdingRewards = [];
    const tokenIdsHandle = [];
    legends.map((legend) => {
      if (!this.isEligible(legend, hRewardSelected.duration)) {
        return;
      }
      if (
        tokenIds.includes(legend.tokenId) ||
        tokenIdsHandle.includes(legend.tokenId)
      ) {
        return;
      }
      const holdingReward = new HoldingReward();
      holdingReward.rewardCode = holdingRewardCode;
      holdingReward.tokenId = legend.tokenId;
      holdingReward.user = user;
      holdingReward.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
      tokenIdsHandle.push(legend.tokenId);
      holdingRewards.push(holdingReward);
    });
    await this.holdingRewardRepository.save(holdingRewards);
    return holdingRewards;
  }

  async process(user: User, legends: Legend[]): Promise<object | null> {
    const holdingRewards = {};
    for (const data of HOLDING_REWARDS) {
      const code = data.code;
      holdingRewards[code] = await this.buildNewHoldingRewards(
        user,
        legends,
        code,
      );
    }
    return holdingRewards;
  }
}
