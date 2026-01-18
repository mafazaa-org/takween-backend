import { IsNotEmpty, IsString } from "class-validator";

export class PhoneVerifyDto {
    @IsString({ message: 'رقم الهاتف يجب أن يكون نص' })
    @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
    phone: string;

    @IsString({ message: 'الرمز المرسل يجب أن يكون نص' })
    @IsNotEmpty({ message: 'الرمز المرسل مطلوب' })
    code: string;
}   