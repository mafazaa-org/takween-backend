import { IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @IsMongoId()
  activityId: string;

  @IsEnum(['daily', 'weekly', 'monthly', 'custom'])
  recurrenceType: string;

  @IsOptional()
  @IsString({ each: true })
  daysOfWeek?: string[];

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  maxOccurrences?: number;

  @IsOptional()
  @IsString()
  description?: string;
}