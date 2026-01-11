import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './token.schema';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [TokenService],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
