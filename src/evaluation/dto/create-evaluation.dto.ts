import { IsNotEmpty, IsString, IsMongoId, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateEvaluationDto {
  @IsMongoId({ message: 'معرف الطالب غير صحيح' })
  @IsNotEmpty({ message: 'الطالب مطلوب' })
  studentId: string;

  @IsMongoId({ message: 'معرف النشاط غير صحيح' })
  @IsNotEmpty({ message: 'النشاط مطلوب' })
  activityId: string;

  @IsNumber({}, { message: 'الدرجة يجب أن تكون عدد' })
  @Min(0, { message: 'الدرجة يجب أن تكون 0 أو أكثر' })
  @Max(100, { message: 'الدرجة يجب أن تكون 100 أو أقل' })
  @IsNotEmpty({ message: 'الدرجة مطلوبة' })
  score: number;

  @IsOptional()
  @IsString({ message: 'ملاحظات التقييم يجب أن تكون نص' })
  feedback?: string;
}