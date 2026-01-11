import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
} from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(15)
  @IsNumberString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
