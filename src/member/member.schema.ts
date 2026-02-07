import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: [true, 'الاسم مطلوب'] })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'المستخدم مطلوب'],
    index: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Entity' }],
    default: [],
  })
  entities: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;
}

export const MemberSchema = SchemaFactory.createForClass(Member);