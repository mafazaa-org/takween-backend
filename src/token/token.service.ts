import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './token.schema';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { Admin, AdminDocument } from 'src/admin/admin.schema';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async generateAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<any>('JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      algorithm: 'HS256',
    });
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async refreshToken(token: string) {
    const existingToken = await this.tokenModel
      .findOneAndDelete({ token }, { new: true })
      .populate('owner', 'id name phone');

    if (!existingToken) {
      throw new UnauthorizedException('رمز غير صالح');
    }

    const newToken = await this.generateRefreshToken(
      existingToken.owner.toJSON() as any,
    );
    return {
      refreshToken: newToken,
      accessToken: await this.generateAccessToken(
        existingToken.owner.toJSON() as any,
      ),
    };
  }

  async generateRefreshToken(owner: AdminDocument) {
    const newToken = randomBytes(32).toString('hex');

    const expiresAt = new Date(
      Date.now() +
        1000 *
          60 *
          60 *
          24 *
          Number(this.configService.get<number>('REFRESH_EXPIRES_IN')),
    );
    await this.tokenModel.create({
      token: newToken,
      expiresAt,
      owner,
    });
    return newToken;
  }
}
