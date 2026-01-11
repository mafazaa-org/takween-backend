import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ParentDocument = Parent & Document;

@Schema({ timestamps: true })
export class Parent {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
  studentIds: Types.ObjectId[];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);

