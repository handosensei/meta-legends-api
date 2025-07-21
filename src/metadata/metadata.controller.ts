import { Controller, Get, Header, Inject, Param, Req } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Public } from '@src/common/decorators/public.decorator';
import { TokenService } from './service/token.service';
import { CollectionService } from './service/collection.service';

@Controller('metadata')
export class MetadataController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly tokenService: TokenService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Header('content-type', 'application/json')
  @Get(':contract')
  async get(@Param('contract') contract: string, @Req() request: Request) {
    const result = await this.tokenService.filterByContractCollection(contract);
    return {
      data: result,
      limit: 50,
      offset: 0,
      total: result.length,
    };
    // const cache = await this.cacheManager.get(`metadata-${collection}`);
    // if (cache != null) {
    //   return cache;
    // }
    // const result = await this.cacheManager.get(`metadata-${collection}`);
    // await this.cacheManager.set(`metadata-${collection}`, result, 3000000);
    // return result;
  }
}
