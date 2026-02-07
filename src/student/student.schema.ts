import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Sitting } from 'src/sitting/sitting.schema';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: [true, 'الاسم مطلوب'] })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Sitting.name }],
    default: [],
  })
  sittings: Types.ObjectId[];

  @Prop({
    index: true,
    minlength: [7, 'رقم هاتف الولي يجب أن يكون على الأقل 7 أرقام'],
    maxlength: [15, 'رقم هاتف الولي يجب أن يكون على الأكثر 15 رقم'],
  })
  parent_phone_number: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

