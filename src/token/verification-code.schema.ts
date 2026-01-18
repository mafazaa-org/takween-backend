import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VerificationCodeDocument = VerificationCode & Document;

@Schema({ timestamps: true })
export class VerificationCode {
    @Prop({ required: true, index: true, unique: true })
    phone: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true, default: Date.now, expires: 300 }) // 5 minutes expiration
    expiresAt: Date;

}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);
