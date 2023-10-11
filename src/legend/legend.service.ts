import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Legend } from './legend.entity';
import { EtherscanService } from '../client/etherscan/etherscan.service';
import { AlchemyService } from '../client/alchemy/alchemy.service';
import { CONTRACT_META_LEGENDS } from '../enum/contract';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  HREWARD_1_CODE,
  HREWARD_1_PERIOD,
  HREWARD_3_CODE,
  HREWARD_3_PERIOD,
  HREWARD_6_CODE,
  HREWARD_6_PERIOD,
  HREWARD_9_CODE,
  HREWARD_9_PERIOD,
  HREWARD_12_CODE,
  HREWARD_12_PERIOD,
  HREWARD_15_CODE,
  HREWARD_15_PERIOD,
  HREWARD_18_CODE,
  HREWARD_18_PERIOD,
  HREWARD_21_CODE,
  HREWARD_21_PERIOD,
  HREWARD_24_CODE,
  HREWARD_24_PERIOD,
} from '../enum/holding-reward';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

@Injectable()
export class LegendService {
  private static readonly logger = new Logger(LegendService.name);
  constructor(
    @InjectRepository(Legend) private legendRepository: Repository<Legend>,
    private readonly etherscanService: EtherscanService,
    private readonly alchemyService: AlchemyService,
  ) {}

  async getNftDataFromAlchemy(address: string): Promise<[number[], object]> {
    const result = {};
    const tokenIds = [];
    let items;
    try {
      const res = await this.alchemyService.getNFTsByWallet(address);
      if ('pageKey' in res) {
        const res2 = await this.alchemyService.getNFTsByWallet(
          address,
          res['pageKey'],
        );
        items = [...res.ownedNfts, ...res2.ownedNfts];
      } else {
        items = res.ownedNfts;
      }
      items.map((item) => {
        const object = {};
        const tokenId = parseInt(item.id.tokenId, 16);
        object['purchasedOn'] = null;
        object['media'] = item.media[0];
        object['tokenId'] = tokenId;
        tokenIds.push(tokenId);
        result[tokenId] = object;
      });
      return [tokenIds, result];
    } catch {
      LegendService.logger.error(`[Service] getNftDataFromAlchemy ${address}`);
      throw new RuntimeException();
    }
  }

  async getNftDataFromEtherscan(address: string): Promise<object> {
    const data = {};
    const tokenIds = [];
    const res = await this.etherscanService.getNFTsByWallet(
      address,
      CONTRACT_META_LEGENDS,
    );
    res.result.map((item) => {
      tokenIds.push(item.tokenID);
      if (data[item.tokenID] == undefined) {
        data[item.tokenID] = [];
      }
      data[item.tokenID].push(item);
    });
    return data;
  }

  async getNfts(address: string) {
    let nftFromBdd = await this.legendRepository.findBy({ address });
    const [tokenIds, nftFromAlchemy] = await this.getNftDataFromAlchemy(
      address,
    );
    nftFromBdd = await this.process(address, tokenIds, nftFromBdd);
    return this.format(nftFromBdd, nftFromAlchemy);
  }

  async getNftsFromBdd(address: string) {
    return await this.legendRepository.findBy({ address });
  }

  async process(
    address: string,
    tokenIds: number[],
    nftFromBdd: Legend[],
  ): Promise<Legend[]> {
    const [toAdd, toRemove] = this.defineUpdate(tokenIds, nftFromBdd);
    let nftFromEtherscan: object = [];
    if (toAdd.length > 0) {
      nftFromEtherscan = await this.getNftDataFromEtherscan(address);
      const newLegends = this.handleAdd(address, nftFromEtherscan, toAdd);
      nftFromBdd.push(...newLegends);
    }
    if (toRemove.length > 0) {
      nftFromBdd = this.handleRemove(address, nftFromBdd, toRemove);
    }
    return nftFromBdd;
  }

  handleRemove(address: string, nftFromBdd: Legend[], toRemove: Legend[]) {
    const nb = toRemove.length;
    if (nb == 0) {
      return;
    }
    try {
      this.legendRepository.remove(toRemove);
      console.log(`Remove ${nb} legend(s) to wallet ${address}`);
    } catch (error) {
      console.log(error);
    }

    return nftFromBdd.filter(
      (itemFromBdd) =>
        !toRemove.some(
          (itemToRemove) => itemToRemove.tokenId === itemFromBdd.tokenId,
        ),
    );
  }

  extractRecentlyTx(address: string, tokenTransactions: object[]): object {
    if (tokenTransactions.length === 1) {
      return tokenTransactions[0];
    }

    let maxTimeStamp = 0;
    let txSelected = null;
    tokenTransactions.map((tx) => {
      if (tx['to'].toLowerCase() !== address) {
        return;
      }

      if (tx['timeStamp'] > maxTimeStamp) {
        txSelected = tx;
        maxTimeStamp = tx['timeStamp'];
      }
    });
    return txSelected;
  }

  handleAdd(
    address: string,
    nftFromEtherscan: object,
    toAdd: number[],
  ): Legend[] | null {
    if (toAdd.length == 0) {
      return [];
    }
    const newLegends: Legend[] = [];
    toAdd.map((tokenId) => {
      const transaction = this.extractRecentlyTx(
        address,
        nftFromEtherscan[tokenId],
      );

      const timestamp = transaction['timeStamp'];
      const purchasedOn = moment(timestamp * 1000).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      const legend = new Legend();
      legend.address = address;
      legend.tokenId = tokenId;
      legend.purchasedOn = purchasedOn;
      legend.progress = true;
      try {
        this.legendRepository.insert(legend);
        console.log(
          `Insert new legend token id ${tokenId} to wallet ${address} purchased on ${purchasedOn}`,
        );
        newLegends.push(legend);
      } catch (error) {
        console.log(error);
      }
    });

    return newLegends;
  }

  defineUpdate(tokenIds: number[], nftFromBdd: Legend[]) {
    const toRemove = [];
    let toAdd = [];
    nftFromBdd.map((item) => {
      const index = tokenIds.indexOf(item.tokenId);
      if (index == -1) {
        toRemove.push(item);
        return;
      }
      tokenIds.splice(index, 1);
    });

    toAdd = tokenIds;

    return [toAdd, toRemove];
  }

  format(nftFromBdd: Legend[], nftFromApi: object): object[] {
    const result = [];
    nftFromBdd.map((legend) => {
      const obj = {
        tokenId: legend.tokenId,
        purchasedOn: legend.purchasedOn,
        media: nftFromApi[legend.tokenId].media,
        holdingRewards: this.defineHoldingRewards(
          new Date(legend.purchasedOn),
          new Date(),
        ),
      };
      result.push(obj);
    });
    return result;
  }

  defineHoldingRewards(purchasedOnDate: Date, now: Date): object {
    const months = moment(now.getTime()).diff(
      purchasedOnDate.getTime(),
      'months',
    );

    return {
      [HREWARD_1_CODE]: HREWARD_1_PERIOD <= months,
      [HREWARD_3_CODE]: HREWARD_3_PERIOD <= months,
      [HREWARD_6_CODE]: HREWARD_6_PERIOD <= months,
      [HREWARD_9_CODE]: HREWARD_9_PERIOD <= months,
      [HREWARD_12_CODE]: HREWARD_12_PERIOD <= months,
      [HREWARD_15_CODE]: HREWARD_15_PERIOD <= months,
      [HREWARD_18_CODE]: HREWARD_18_PERIOD <= months,
      [HREWARD_21_CODE]: HREWARD_21_PERIOD <= months,
      [HREWARD_24_CODE]: HREWARD_24_PERIOD <= months,
    };
  }

  async findAll(): Promise<Legend[]> {
    return await this.legendRepository.find();
  }

  async update(legend: Legend): Promise<Legend> {
    await this.legendRepository.save(legend);
    return legend;
  }
}
