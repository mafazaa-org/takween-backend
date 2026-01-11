import { Controller, Body, Post, Req, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { Types } from 'mongoose';
import { AuthGuard } from './auth.guard';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.tokenService.refreshToken(body.refreshToken);
  }
}
