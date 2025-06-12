import { Injectable, Logger } from '@nestjs/common';
import { CollectionService } from '@src/metadata/service/collection.service';
import { Command, CommandRunner } from 'nest-commander';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import {
  TRAIT_SAVED,
  TOKEN_ATTRIBUTE_SAVED,
  ATTRIBUTE_PERCENT_PROCESSED,
  RANK_EXECUTED,
} from '@src/enum/metadata-dump';
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

    // TOKEN_ATTRIBUTE_SAVED
    const pathDirectory = this.collectionService.getPathDirectory(collection);
    const traitTypes = await this.traitTypeService.saveTraitTypes(
      collection,
      pathDirectory,
    );
    const attributes = await this.attributeService.saveAttributes(
      collection,
      traitTypes,
      pathDirectory,
    );
    await this.tokenAttributeService.saveTokenAttributes(attributes, pathDirectory);


    //   DumpService.logger.log(test);
    // } catch (error) {
    //   DumpService.logger.log(error);
    // }
    // try {
    //   while (collection.status !== RANK_EXECUTED) {
    //     console.log(collection.status);
    //     switch (collection.status) {
    //       case TRAIT_SAVED:
    //         this.collectionService.processTokenAttributesBinding(collection);
    //         collection.status = TOKEN_ATTRIBUTE_SAVED;
    //         break;
    //       case TOKEN_ATTRIBUTE_SAVED:
    //         this.collectionService.processAttributePercent(collection);
    //         collection.status = ATTRIBUTE_PERCENT_PROCESSED;
    //         break;
    //       case ATTRIBUTE_PERCENT_PROCESSED:
    //         this.collectionService.processRank(collection);
    //         collection.status = RANK_EXECUTED;
    //         break;
    //       default:
    //         throw new RuntimeException(
    //           `Unknown status '${collection.status}' for collection '${collection.name}'`,
    //         );
    //     }
    //   }
    // } catch (error) {
    //   DumpService.logger.log(error);
    // }
  }
}
