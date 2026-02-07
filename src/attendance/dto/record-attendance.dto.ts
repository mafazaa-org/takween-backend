import { IsBoolean, IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class RecordAttendanceDto {
  @IsMongoId()
  studentId: string;

  @IsMongoId()
  sittingId: string;

  @IsBoolean()
  present: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}