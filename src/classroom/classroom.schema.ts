import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassroomDocument = Classroom & Document;

@Schema({ timestamps: true })
export class Classroom {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true, index: true })
  activityId: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  customFields: Record<string, any>;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
