import { Controller, Body, Post } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.tokenService.refreshToken(body.refreshToken);
  }
}
