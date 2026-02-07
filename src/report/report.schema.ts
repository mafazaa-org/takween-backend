import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({
    type: String,
    required: [true, 'نوع التقرير مطلوب'],
    enum: ['attendance', 'performance', 'enrollment', 'activity', 'custom'],
  })
  type: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Entity',
    required: [true, 'الكيان مطلوب'],
    index: true,
  })
  entity: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Activity',
    index: true,
  })
  activity: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    index: true,
  })
  generatedBy: Types.ObjectId;

  @Prop({
    type: Date,
    required: [true, 'تاريخ البدء مطلوب'],
  })
  startDate: Date;

  @Prop({
    type: Date,
    required: [true, 'تاريخ الانتهاء مطلوب'],
  })
  endDate: Date;

  @Prop({
    type: Object,
    required: [true, 'بيانات التقرير مطلوبة'],
  })
  data: Record<string, any>;

  @Prop({
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
    default: 'custom',
  })
  period: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(Report);