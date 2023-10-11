import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { LegendService } from '@src/legend/legend.service';
import { AlchemyService } from '@src/client/alchemy/alchemy.service';
import { Legend } from '@src/legend/legend.entity';

// npm run command-nest legend-set-progress
@Command({
  name: 'legend-set-progress',
  description: 'Set progress legends in database',
})
@Injectable()
export class LegendProgressService extends CommandRunner {
  private static readonly logger = new Logger(LegendProgressService.name);

  constructor(
    private legendService: LegendService,
    private alchemyService: AlchemyService,
  ) {
    super();
  }

  async run() {
    LegendProgressService.logger.log('[Command] LegendProgressService');
    const data = await this.alchemyService.getOwnersForCollectionML();
    LegendProgressService.logger.log(
      `Nb holders ${data.ownerAddresses.length}`,
    );
    const walletsTokenIds = {};
    const wallets = [];
    data.ownerAddresses.map(async (walletContent) => {
      const tokenIds = [];
      walletContent.tokenBalances.forEach((nft) => {
        tokenIds.push(parseInt(nft.tokenId, 16));
      });
      wallets.push(walletContent.ownerAddress.toLowerCase());
      walletsTokenIds[walletContent.ownerAddress.toLowerCase()] = tokenIds;
    });
    let tokenSaved = 0;
    let afkHolders = 0;
    for (const wallet of wallets) {
      const legends = await this.legendService.getNftsFromBdd(wallet);
      if (legends.length === 0) {
        afkHolders++;
        continue;
      }

      const tokenIds = walletsTokenIds[wallet];
      for (const legend of legends) {
        if (tokenIds.includes(legend.tokenId)) {
          legend.progress = true;
          await this.legendService.update(legend);
          tokenSaved++;
        }
      }
    }

    LegendProgressService.logger.log(`[Command] Nb holders afk ${afkHolders}`);
    LegendProgressService.logger.log(
      `[Command] activate progress to ${tokenSaved} NFT`,
    );
  }
}
