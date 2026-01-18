import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VerificationCode, VerificationCodeDocument } from "./verification-code.schema";

@Injectable()
export class VerificationCodeService {
    constructor(
        @InjectModel(VerificationCode.name) private verificationCodeModel: Model<VerificationCodeDocument>,
    ) { }

    async generateVerificationCode(phone: string) {
        const existingVerificationCode = await this.verificationCodeModel.findOne({ phone });
        if (existingVerificationCode) {
            await existingVerificationCode.deleteOne();
        }
        const verificationCode = await this.verificationCodeModel.create({ phone, code: Math.floor(100000 + Math.random() * 900000).toString() });

        console.log("verification code: ", verificationCode.code);
        //TODO: Send code to phone
        return verificationCode;
    }

    async verifyVerificationCode({ phone, code }: { phone: string, code: string }): Promise<boolean> {
        const verificationCode = await this.verificationCodeModel.findOne({ phone });
        if (!verificationCode) {
            throw new NotFoundException("لا يوجد رموز لهذا الرقم، برجاء إعادة المحاولة مرة أخرى");
        }
        if (verificationCode.code !== code) {
            throw new BadRequestException("الرمز المرسل غير صحيح");
        }

        await verificationCode.deleteOne();

        return true;
    }
}