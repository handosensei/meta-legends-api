import { Controller, Post, Header, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@src/auth/auth.guard';
import { Request } from 'express';
import { UserService } from '@src/user/user.service';

@Controller('wallets')
export class WalletController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Header('content-type', 'application/json')
  @Post()
  async post(@Req() request: Request) {
    const user = await this.userService.findOne(request['user-wallet']);
    return user.wallets;
  }
}
