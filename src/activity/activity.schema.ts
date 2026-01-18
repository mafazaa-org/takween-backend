import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: [true, 'الاسم مطلوب'] })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Entity',
    required: [true, 'الكيان مطلوب'],
    index: true,
  })
  entity: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  price: number;

}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
