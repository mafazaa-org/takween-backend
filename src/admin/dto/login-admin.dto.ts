import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
