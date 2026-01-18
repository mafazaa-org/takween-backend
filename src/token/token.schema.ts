import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true, index: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Create TTL index on expiresAt field for automatic deletion
// MongoDB will automatically delete documents when expiresAt date has passed
// The expiresAt value is calculated in TokenService using REFRESH_EXPIRES_IN environment variable
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });