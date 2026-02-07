import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'المرسل مطلوب'],
  })
  sender: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Activity',
    required: [true, 'النشاط مطلوب'],
  })
  activity: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  recipients: Types.ObjectId[];

  @Prop({ required: [true, 'محتوى الرسالة مطلوب'] })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({
    type: [{ 
      user: { type: Types.ObjectId, ref: 'User' },
      readAt: Date
    }],
    default: [],
  })
  readReceipts: Array<{
    user: Types.ObjectId;
    readAt?: Date;
  }>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);