import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @IsString({ message: 'رقم الهاتف يجب أن يكون نص' })
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  phone: string;
}
