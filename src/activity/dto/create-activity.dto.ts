import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}
