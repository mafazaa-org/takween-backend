import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateActivityDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}
