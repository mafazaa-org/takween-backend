import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class VerificationCodeService {
    private twilioClient: any;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
        const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");

        if (accountSid && authToken) {
            try {
                const twilio = require("twilio");
                this.twilioClient = twilio(accountSid, authToken);
            } catch (error) {
                console.warn("Twilio package not installed. SMS will not be sent.");
            }
        }
    }

    async generateVerificationCode(phone: string) {
        const verifyServiceSid = this.configService.get<string>("TWILIO_VERIFY_SERVICE_SID");

        try {
            await this.twilioClient.verify.v2
                .services(verifyServiceSid)
                .verifications.create({
                    to: phone,
                    channel: "sms",
                });
        } catch (error: any) {
            console.error("Twilio SMS error:", error);
            throw new BadRequestException("فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى");
        }

    }

    async verifyVerificationCode({ phone, code }: { phone: string, code: string }): Promise<boolean> {
        const verifyServiceSid = this.configService.get<string>("TWILIO_VERIFY_SERVICE_SID");

        try {
            const verificationCheck = await this.twilioClient.verify.v2
                .services(verifyServiceSid)
                .verificationChecks.create({
                    to: phone,
                    code: code,
                });

            if (verificationCheck.status === "approved") {
                return true;
            } else {
                throw new BadRequestException("الرمز المرسل غير صحيح");
            }
        } catch (error: any) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            // Handle Twilio-specific errors
            if (error.code === 20404 || error.status === 404) {
                throw new NotFoundException("لا يوجد رموز لهذا الرقم، برجاء إعادة المحاولة مرة أخرى");
            }

            console.error("Twilio verification error:", error);
            throw new BadRequestException("الرمز المرسل غير صحيح");
        }

    }
}