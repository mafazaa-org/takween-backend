import { IsOptional, IsString, IsMongoId, IsDateString } from 'class-validator';

export class UpdateHomeworkDto {
  @IsOptional()
  @IsString({ message: 'عنوان الواجب يجب أن يكون نص' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'وصف الواجب يجب أن يكون نص' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'تاريخ الاستحقاق يجب أن يكون نص' })
  dueDate?: string;

  @IsOptional()
  @IsMongoId({ each: true, message: 'معرف الطالب غير صحيح' })
  assignedTo?: string[];
}