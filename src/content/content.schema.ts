import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContentDocument = Content & Document;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: [true, 'عنوان المحتوى مطلوب'] })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Activity',
    required: [true, 'النشاط مطلوب'],
  })
  activity: Types.ObjectId;

  @Prop()
  fileName: string;

  @Prop()
  fileType: string;

  @Prop()
  fileUrl: string;

  @Prop({ type: Number })
  fileSize: number;

  @Prop({
    type: String,
    enum: ['pdf', 'video', 'audio', 'image', 'document', 'other'],
    default: 'document',
  })
  contentType: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Student' }],
    default: [],
  })
  accessedBy: Types.ObjectId[];

  @Prop({ default: 0 })
  downloadCount: number;
}

export const ContentSchema = SchemaFactory.createForClass(Content);