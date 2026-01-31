import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Classroom } from 'src/classroom/classroom.schema';

export type SittingDocument = Sitting & Document;

@Schema({ timestamps: true })
export class Sitting {
    @Prop({
        type: Date,
        required: [true, 'التاريخ مطلوب'],
        index: true,
    })
    date: Date;

    @Prop({
        type: Types.ObjectId,
        ref: Classroom.name,
        required: [true, 'الفصل مطلوب'],
        index: true,
    })
    classroom: Types.ObjectId;
}

export const SittingSchema = SchemaFactory.createForClass(Sitting);

