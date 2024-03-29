import {
  Controller,
  Get,
  Header,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OgPetService } from './og-pet/og-pet.service';
import { AuthGuard } from '@src/auth/auth.guard';
import { Request } from 'express';

@Controller('eligibility')
export class EligibilityController {
  constructor(private ogPetService: OgPetService) {}

  @UseGuards(AuthGuard)
  @Header('content-type', 'application/json')
  @Get('og-pets')
  async estimateOgPets(@Req() request: Request) {
    const ogPet = await this.ogPetService.getEstimateByWallet(
      request['user-wallet'],
    );
    if (null == ogPet) {
      return this.ogPetService.getEmptyOgPet(request['user-wallet']);
    }
    return ogPet;
  }
}
