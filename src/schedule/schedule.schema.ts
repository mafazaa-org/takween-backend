import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({
    type: Types.ObjectId,
    ref: 'Activity',
    required: [true, 'النشاط مطلوب'],
    index: true,
  })
  activity: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    required: [true, 'نوع التكرار مطلوب'],
  })
  recurrenceType: string;

  @Prop({
    type: [String],
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    default: [],
  })
  daysOfWeek: string[];

  @Prop({
    type: Date,
    required: [true, 'وقت البدء مطلوب'],
  })
  startTime: Date;

  @Prop({
    type: Date,
    required: [true, 'وقت الانتهاء مطلوب'],
  })
  endTime: Date;

  @Prop({
    type: Date,
    required: [true, 'تاريخ البدء مطلوب'],
  })
  startDate: Date;

  @Prop({
    type: Date,
  })
  endDate: Date;

  @Prop({
    type: Number,
  })
  maxOccurrences: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop()
  description: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);