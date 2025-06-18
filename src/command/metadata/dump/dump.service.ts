import { Injectable, Logger } from '@nestjs/common';
import { CollectionService } from '@src/metadata/service/collection.service';
import { Command, CommandRunner } from 'nest-commander';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import {
  ADDED,
  RANK_EXECUTED, ATTRIBUTE_SAVED, ATTRIBUTE_BINDED,
} from "@src/enum/metadata-dump";
import { TraitTypeService } from '@src/metadata/service/trait-type.service';
import { AttributeService } from '@src/metadata/service/attribute.service';
import { TokenAttributeService } from '@src/metadata/service/token-attribute.service';
/*
npm run command-nest metadata-dump [contract] [name]
npm run command-nest metadata-dump 0xf9c362cdd6eeba080dd87845e88512aa0a18c615 "Meta-Legends"
 */
@Command({
  name: 'metadata-dump',
  description: 'Dump metadata in database',
})
@Injectable()
export class DumpService extends CommandRunner {
  private static readonly logger = new Logger(DumpService.name);

  constructor(
    private collectionService: CollectionService,
    private traitTypeService: TraitTypeService,
    private attributeService: AttributeService,
    private tokenAttributeService: TokenAttributeService,
  ) {
    super();
  }

  async run(passedParam: string[]) {
    DumpService.logger.log('[Command] DumpService');
    const contract = passedParam[0];
    const name = passedParam[1];
    const blockchain = passedParam[2];
    const collection = await this.collectionService.getOneByContractOrCreate(
      contract,
      name,
      blockchain,
    );

    console.log(collection.status);
    try {
      while (collection.status !== RANK_EXECUTED) {
        switch (collection.status) {
          case ADDED:
            this.collectionService.processSaveAttributes(collection);
            collection.status = ATTRIBUTE_SAVED;
            break;
          case ATTRIBUTE_SAVED:
            this.collectionService.processBindAttributes(collection);
            collection.status = ATTRIBUTE_BINDED;
            break;
          case ATTRIBUTE_BINDED:
            this.collectionService.processRank(collection);
            collection.status = RANK_EXECUTED;
            break;
          default:
            throw new RuntimeException(
              `Unknown status '${collection.status}' for contract '${collection.contract}'`,
            );
        }
      }
    } catch (error) {
      DumpService.logger.log(
        `Dump error - status ${collection.status} : ${error}`,
      );
    }
  }
}
