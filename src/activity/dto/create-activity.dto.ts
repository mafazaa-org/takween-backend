import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateActivityDto {
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsMongoId({ message: 'معرف الكيان غير صالح' })
  @IsNotEmpty({ message: 'الكيان مطلوب' })
  entity: string;

  @IsOptional()
  @IsNumber({}, { message: 'السعر يجب أن يكون رقم' })
  @Min(0, { message: 'السعر يجب أن يكون أكبر من أو يساوي صفر' })
  price?: number;
}
