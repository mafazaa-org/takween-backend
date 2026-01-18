import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassroomDocument = Classroom & Document;

@Schema({ timestamps: true })
export class Classroom {
  @Prop({ required: [true, 'الاسم مطلوب'] })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Activity',
    required: [true, 'النشاط مطلوب'],
    index: true,
  })
  activity: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Teacher' }], default: [] })
  teachers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
  students: Types.ObjectId[];

}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
