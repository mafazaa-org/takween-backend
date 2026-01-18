import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateActivityDto {
  @IsOptional()
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'السعر يجب أن يكون رقم' })
  @Min(0, { message: 'السعر يجب أن يكون أكبر من أو يساوي صفر' })
  price?: number;
}
