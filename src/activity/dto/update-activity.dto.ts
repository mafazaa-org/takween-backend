import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateActivityDto {
  @IsOptional()
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name?: string;

  @IsOptional()
  @IsObject({ message: 'الحقول المخصصة يجب أن تكون كائن' })
  customFields?: Record<string, any>;
}
