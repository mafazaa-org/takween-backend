import { IsNotEmpty, IsString, IsMongoId, IsOptional, IsObject } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  activityId: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}

