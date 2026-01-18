import {
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';

export class UpdateUserDto {
    @IsString({ message: 'الاسم يجب أن يكون نص' })
    @MinLength(3, { message: 'الاسم يجب أن يكون على الأقل 3 أحرف' })
    @MaxLength(50, { message: 'الاسم يجب أن يكون على الأكثر 50 حرف' })
    name?: string;
}
