import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: [true, 'الطالب مطلوب'],
    index: true,
  })
  student: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Sitting',
    required: [true, 'الجلسة مطلوبة'],
    index: true,
  })
  sitting: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  present: boolean;

  @Prop({
    type: Date,
    default: Date.now,
  })
  recordedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  recordedBy: Types.ObjectId;

  @Prop()
  notes: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);