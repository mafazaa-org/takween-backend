import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ParentDocument = Parent & Document;

@Schema({ timestamps: true })
export class Parent {
  @Prop({
    required: [true, 'رقم الهاتف مطلوب'],
    unique: [true, 'رقم الهاتف مسجل بالفعل'],
  })
  phone: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
  students: Types.ObjectId[];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);

