import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  data?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}