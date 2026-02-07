import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateEvaluationDto {
  @IsOptional()
  @IsNumber({}, { message: 'الدرجة يجب أن تكون عدد' })
  @Min(0, { message: 'الدرجة يجب أن تكون 0 أو أكثر' })
  @Max(100, { message: 'الدرجة يجب أن تكون 100 أو أقل' })
  score?: number;

  @IsOptional()
  @IsString({ message: 'ملاحظات التقييم يجب أن تكون نص' })
  feedback?: string;
}