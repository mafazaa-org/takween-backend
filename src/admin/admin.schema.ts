import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    required: [true, 'الاسم مطلوب'],
    minlength: [3, 'الاسم يجب أن يكون على الأقل 3 أحرف'],
    maxlength: [50, 'الاسم يجب أن يكون على الأكثر 50 حرف'],
  })
  name: string;

  @Prop({
    required: [true, 'رقم الهاتف مطلوب'],
    index: true,
    unique: [true, 'رقم الهاتف مسجل بالفعل'],
    minlength: [7, 'رقم الهاتف يجب أن يكون على الأقل 7 أرقام'],
    maxlength: [15, 'رقم الهاتف يجب أن يكون على الأكثر 15 رقم'],
  })
  phone: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
