import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
} from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(15)
  @IsNumberString()
  phone?: string;
}
