import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HomeworkDocument = Homework & Document;

@Schema({ timestamps: true })
export class Homework {
  @Prop({ required: [true, 'عنوان الواجب مطلوب'] })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Activity',
    required: [true, 'النشاط مطلوب'],
  })
  activity: Types.ObjectId;

  @Prop({
    type: Date,
    required: [true, 'تاريخ الاستحقاق مطلوب'],
  })
  dueDate: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Student' }],
    default: [],
  })
  assignedTo: Types.ObjectId[];

  @Prop({
    type: [{ 
      student: { type: Types.ObjectId, ref: 'Student' },
      submitted: { type: Boolean, default: false },
      submittedAt: Date,
      grade: Number,
      feedback: String
    }],
    default: [],
  })
  submissions: Array<{
    student: Types.ObjectId;
    submitted: boolean;
    submittedAt?: Date;
    grade?: number;
    feedback?: string;
  }>;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);