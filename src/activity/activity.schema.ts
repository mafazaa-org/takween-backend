import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Entity', required: true, index: true })
  entityId: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  customFields: Record<string, any>;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
