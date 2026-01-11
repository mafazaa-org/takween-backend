import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Admin } from 'src/admin/admin.schema';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true, index: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: Admin.name })
  owner: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
