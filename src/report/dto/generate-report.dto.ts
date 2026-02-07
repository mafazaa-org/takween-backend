import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsEnum(['attendance', 'performance', 'enrollment', 'activity', 'custom'])
  type: string;

  @IsMongoId()
  entityId: string;

  @IsOptional()
  @IsMongoId()
  activityId?: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly', 'custom'])
  period?: string;
}