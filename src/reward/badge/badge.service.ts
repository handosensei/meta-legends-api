import { Injectable } from '@nestjs/common';
export const PERK_BADGE_SNIPER_BRONZE = 'sniperBronze';
export const PERK_BADGE_ARMOR_CYBER = 'armorCyber';
export const PERK_BADGE_WEAPON_GOLDBOI = 'weaponGoldboi';
export const PERK_BADGE_CYBER_PET = 'cyberPet';
export const PERK_BADGE_GOLDBOI_CAR = 'goldboiCar';
export const PERK_BADGE_SNIPER_RIFLE_CELESTIAL = 'sniperRifleCelestial';

@Injectable()
export class BadgeService {
  getRewardBadge(nbNftHold: number): object {
    if (nbNftHold === 0) {
      return this.initBadgeRewards(0);
    }

    const badgeRewardsValue = Math.floor(Number(nbNftHold / 51));
    const badgeRewards = this.initBadgeRewards(badgeRewardsValue);
    const moduloNbNft = nbNftHold % 51;

    if (moduloNbNft > 20) {
      badgeRewards[PERK_BADGE_GOLDBOI_CAR]++;
    }
    if (moduloNbNft > 10) {
      badgeRewards[PERK_BADGE_CYBER_PET]++;
    }
    if (moduloNbNft > 5) {
      badgeRewards[PERK_BADGE_WEAPON_GOLDBOI]++;
    }
    if (moduloNbNft > 2) {
      badgeRewards[PERK_BADGE_ARMOR_CYBER]++;
    }
    if (moduloNbNft > 0) {
      badgeRewards[PERK_BADGE_SNIPER_BRONZE]++;
    }

    return badgeRewards;
  }

  initBadgeRewards(initValue): object {
    return {
      [PERK_BADGE_SNIPER_BRONZE]: initValue,
      [PERK_BADGE_ARMOR_CYBER]: initValue,
      [PERK_BADGE_WEAPON_GOLDBOI]: initValue,
      [PERK_BADGE_CYBER_PET]: initValue,
      [PERK_BADGE_GOLDBOI_CAR]: initValue,
      [PERK_BADGE_SNIPER_RIFLE_CELESTIAL]: initValue,
    };
  }

  defineBadgeReward(nbNftHold: number) {
    return [];
  }

}
