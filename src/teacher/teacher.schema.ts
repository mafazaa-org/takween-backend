import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entity } from '../entity/entity.schema';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
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

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Activity' }],
    default: [],
  })
  activities: Types.ObjectId[];

  @Prop()
  specialization: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);