import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: [true, 'الاسم مطلوب'] })
  name: string;

  @Prop({
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: [true, 'البريد الإلكتروني مسجل بالفعل'],
  })
  email: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Classroom' }], default: [] })
  classrooms: Types.ObjectId[];
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
