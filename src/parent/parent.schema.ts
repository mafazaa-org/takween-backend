import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ParentDocument = Parent & Document;

@Schema({ timestamps: true })
export class Parent {
    @Prop({
        required: [true, 'الرقم مطلوب'],
        index: true,
        unique: [true, 'الرقم مسجل بالفعل'],
        minlength: [7, 'الرقم يجب أن يكون على الأقل 7 أرقام'],
        maxlength: [15, 'الرقم يجب أن يكون على الأكثر 15 رقم']
    })
    phone: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
    students: Types.ObjectId[];

}

export const ParentSchema = SchemaFactory.createForClass(Parent);
