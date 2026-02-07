import { IsNotEmpty, IsString, IsMongoId, IsDateString, IsOptional } from 'class-validator';

export class CreateHomeworkDto {
  @IsString({ message: 'عنوان الواجب يجب أن يكون نص' })
  @IsNotEmpty({ message: 'عنوان الواجب مطلوب' })
  title: string;

  @IsOptional()
  @IsString({ message: 'وصف الواجب يجب أن يكون نص' })
  description?: string;

  @IsMongoId({ message: 'معرف النشاط غير صحيح' })
  @IsNotEmpty({ message: 'النشاط مطلوب' })
  activityId: string;

  @IsString({ message: 'تاريخ الاستحقاق يجب أن يكون نص' })
  @IsNotEmpty({ message: 'تاريخ الاستحقاق مطلوب' })
  dueDate: string;

  @IsOptional()
  @IsMongoId({ each: true, message: 'معرف الطالب غير صحيح' })
  assignedTo?: string[];
}