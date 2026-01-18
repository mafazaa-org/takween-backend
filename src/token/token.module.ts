import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './token.schema';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCode, VerificationCodeSchema } from './verification-code.schema';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: VerificationCode.name, schema: VerificationCodeSchema }]),
  ],
  providers: [TokenService, AuthGuard, VerificationCodeService],
  controllers: [TokenController],
  exports: [TokenService, AuthGuard, VerificationCodeService],
})
export class TokenModule {}
