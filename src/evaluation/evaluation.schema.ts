import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvaluationDocument = Evaluation & Document;

@Schema({ timestamps: true })
export class Evaluation {
  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: [true, 'الطالب مطلوب'],
  })
  student: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Activity',
    required: [true, 'النشاط مطلوب'],
  })
  activity: Types.ObjectId;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    required: [true, 'الدرجة مطلوبة'],
  })
  score: number;

  @Prop()
  feedback: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  evaluationDate: Date;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);