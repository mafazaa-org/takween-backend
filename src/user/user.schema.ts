import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
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
    
    @Prop({enum: ["sheikh", "admin", "teacher", "student", "member"], required: [true, 'النوع مطلوب']})
    type: "sheikh" | "admin" | "teacher" | "student" | "member"

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'Entity' }],
        default: [],
    })
    entities: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
