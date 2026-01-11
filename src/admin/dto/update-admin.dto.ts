import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
} from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @MinLength(3, { message: 'الاسم يجب أن يكون على الأقل 3 أحرف' })
  @MaxLength(50, { message: 'الاسم يجب أن يكون على الأكثر 50 حرف' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'رقم الهاتف يجب أن يكون نص' })
  @MinLength(7, { message: 'رقم الهاتف يجب أن يكون على الأقل 7 أرقام' })
  @MaxLength(15, { message: 'رقم الهاتف يجب أن يكون على الأكثر 15 رقم' })
  @IsNumberString({}, { message: 'رقم الهاتف يجب أن يحتوي على أرقام فقط' })
  phone?: string;
}
