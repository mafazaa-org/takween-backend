import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class PhoneRegisterDto {
    @IsString({ message: 'رقم الهاتف يجب أن يكون نص' })
    @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
    phone: string;

    @IsEnum(["admin", "teacher", "parent"], { message: 'النوع يجب أن يكون نص' })
    @IsNotEmpty({ message: 'النوع مطلوب' })
    type: "admin" | "teacher" | "parent";
}