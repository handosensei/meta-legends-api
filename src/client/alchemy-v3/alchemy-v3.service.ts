import { Injectable } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import axios from 'axios';

export const ETHEREUM_MAINNET = 'mainnet';
export const ETHEREUM_TESTNET = 'sepolia';
export const POLYGON_MAINNET = 'mainnet';
export const POLYGON_TESTNET = 'amoy';

export const NETWORKS = {
  eth: [ETHEREUM_MAINNET, ETHEREUM_TESTNET],
  polygon: [POLYGON_MAINNET, POLYGON_TESTNET],
};

export const GET_NFTS_FOR_OWNER = 'getNFTsForOwner';
export const GET_NFT_METADATA_BATCH = 'getNFTMetadataBatch';

@Injectable()
export class AlchemyV3Service {
  private blockchain: string;
  private network: string;

  setBlockchainAndNetwork(blockchain: string, network: string) {
    this.blockchain = blockchain;
    this.network = network;
  }

  getBlockchain(): string {
    return this.blockchain;
  }

  getNetwork(): string {
    return this.network;
  }

  buildUrl(): string {
    if (!Object.keys(NETWORKS).includes(this.blockchain)) {
      const message = `Unknow blockchain ${this.blockchain}`;
      console.log(message);
      new RuntimeException(message);
    }
    if (!NETWORKS[this.blockchain].includes(this.network)) {
      const message = `Unknow network ${this.network}`;
      console.log(message);
      new RuntimeException(message);
    }
    return `https://${this.blockchain}-${this.network}.g.alchemy.com`;
  }

  async get(method: string, params): Promise<any> {
    const query = new URLSearchParams(params);
    const alchemyUrl = this.buildUrl();
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    const url = `${alchemyUrl}/nft/v3/${alchemyApiKey}/${method}?${query.toString()}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async post(method, payload: any): Promise<any> {
    const alchemyUrl = this.buildUrl();
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    const url = `${alchemyUrl}/nft/v3/${alchemyApiKey}/${method}`;
    try {
      const response = await axios.post(url, payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
