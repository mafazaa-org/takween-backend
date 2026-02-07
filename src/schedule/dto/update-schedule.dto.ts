import { IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateScheduleDto {
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly', 'custom'])
  recurrenceType?: string;

  @IsOptional()
  @IsString({ each: true })
  daysOfWeek?: string[];

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  maxOccurrences?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  isActive?: boolean;
}